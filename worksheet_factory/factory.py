import os
import json
import asyncio
from openai import AsyncOpenAI
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from supabase import create_client, Client
import questionary
import random
from collections import defaultdict

# Load environment variables
load_dotenv('.env.local')

API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables")

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials not found in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

client = AsyncOpenAI(api_key=API_KEY)
MODEL_NAME = "gpt-4.1-nano"
OUTPUT_DIR = "output"

# Language mapping
LANGUAGE_MAP = {
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'en': 'English'
}

def format_topic_title(raw_topic):
    """
    Convert ugly database topic names into nice display titles.
    Examples:
        'KS3: basics_core_language - numbers_1_30' → 'KS3: Basics Core Language - Numbers 1-30'
        'KS4: identity_relationships - family_members' → 'KS4: Identity & Relationships - Family Members'
    """
    import re
    
    # Replace underscores with spaces
    title = raw_topic.replace('_', ' ')
    
    # Fix number ranges like "1 30" → "1-30"
    title = re.sub(r'(\d+)\s+(\d+)', r'\1-\2', title)
    
    # Title case each word, but preserve KS3/KS4
    words = title.split()
    formatted_words = []
    for word in words:
        upper = word.upper().rstrip(':')
        if upper in ['KS3', 'KS4', 'GCSE', 'AQA', 'EDEXCEL']:
            formatted_words.append(upper + (':' if word.endswith(':') else ''))
        elif word.lower() in ['a', 'and', 'the', 'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by']:
            formatted_words.append(word.lower())
        elif '-' in word and not word[0].isdigit():
            # Handle hyphenated words
            formatted_words.append('-'.join(p.capitalize() for p in word.split('-')))
        else:
            formatted_words.append(word.capitalize())
    
    return ' '.join(formatted_words)

# --- 1. SIMPLIFIED PROMPT (Let Python handle the geometry) ---
SYSTEM_PROMPT = """
You are a strict JSON generator for language learning worksheets.
Output strict JSON only.

Schema:
{
  "meta": { "topic": "string", "language": "string" },
  "vocab": [ {"target": "string", "english": "string"} ], // 15 items
  "crossword_words": [
      { "answer": "string", "clue": "string" } 
  ], // 8-10 items. 'answer' must be from vocab. 'clue' in English. KEEP ACCENTS and SPACES in 'answer'.
  "matching": [ {"target": "string", "english": "string"} ], // 10 items
  "translation": [ "string" ], // 10 English words to translate
  "unjumble_solutions": [ "string" ], // 6 items. Single words from vocab.
  "multiple_choice": [
      { 
        "question": "string", // In English
        "options": ["str", "str", "str"], // In Target Language
        "answer": "string" // Correct option
      }
  ] // 8 items
}
Constraints:
1. Crossword answers: Provide the full word/phrase with spaces/accents.
2. Unjumble solutions: Must be single words from vocab (no phrases).
3. Crossword Clues: Must be in English.
4. Multiple Choice: Questions in English, Answers in Target Language. KEEP SPACES and ACCENTS.
"""

# --- 2. GEOMETRY ENGINE (Custom Implementation) ---
class CrosswordGenerator:
    def __init__(self, width=12, height=12):
        self.width = width
        self.height = height
        self.grid = [['' for _ in range(width)] for _ in range(height)]
        self.words = [] # List of {'answer', 'clue', 'row', 'col', 'orientation'}

    def is_valid(self, word, row, col, orientation):
        # Check bounds
        if orientation == 'across':
            if col + len(word) > self.width: return False
        else:
            if row + len(word) > self.height: return False

        # Check collisions and intersections
        has_intersection = False
        
        for i in range(len(word)):
            r = row + (0 if orientation == 'across' else i)
            c = col + (i if orientation == 'across' else 0)
            
            cell = self.grid[r][c]
            if cell == '':
                pass
            elif cell == word[i]:
                has_intersection = True
            else:
                return False # Conflict
            
            # Strict neighbor check to prevent "clumping"
            if orientation == 'across':
                # Check top/bottom neighbors
                if self.grid[r][c] == '': # Only if we are filling a new cell
                    if r > 0 and self.grid[r-1][c] != '': return False
                    if r < self.height-1 and self.grid[r+1][c] != '': return False
                # Check left/right of word start/end
                if i == 0 and c > 0 and self.grid[r][c-1] != '': return False
                if i == len(word)-1 and c < self.width-1 and self.grid[r][c+1] != '': return False
            else: # down
                # Check left/right neighbors
                if self.grid[r][c] == '':
                    if c > 0 and self.grid[r][c-1] != '': return False
                    if c < self.width-1 and self.grid[r][c+1] != '': return False
                # Check top/bottom of word start/end
                if i == 0 and r > 0 and self.grid[r-1][c] != '': return False
                if i == len(word)-1 and r < self.height-1 and self.grid[r+1][c] != '': return False

        # Must intersect at least one existing word (unless it's the first word)
        if not self.words: return True
        return has_intersection

    def place(self, word, row, col, orientation):
        for i in range(len(word)):
            r = row + (0 if orientation == 'across' else i)
            c = col + (i if orientation == 'across' else 0)
            self.grid[r][c] = word[i]

    def generate(self, word_list, attempts=50):
        # word_list: [{'answer', 'clue'}]
        # Sort by length
        sorted_words = sorted(word_list, key=lambda x: len(x['answer']), reverse=True)
        
        best_layout = []
        
        for _ in range(attempts):
            self.grid = [['' for _ in range(self.width)] for _ in range(self.height)]
            self.words = []
            
            if not sorted_words: break

            # Place first word in center
            first = sorted_words[0]
            fr = self.height // 2
            fc = (self.width - len(first['answer'])) // 2
            placed_first = {**first, 'row': fr, 'col': fc, 'orientation': 'across'}
            self.place(first['answer'], fr, fc, 'across')
            self.words.append(placed_first)
            
            # Try to place others
            current_words = [placed_first]
            remaining = sorted_words[1:]
            
            # Simple randomized greedy placement
            random.shuffle(remaining)
            
            for word_obj in remaining:
                word = word_obj['answer']
                placed = False
                # Try to find intersection with placed words
                potential_spots = []
                
                for placed_word in current_words:
                    # Find common letters
                    p_word = placed_word['answer']
                    for i, char in enumerate(word):
                        for j, p_char in enumerate(p_word):
                            if char == p_char:
                                # Potential intersection
                                # If placed is across, we try down
                                if placed_word['orientation'] == 'across':
                                    # Intersection at grid[r][c]
                                    # placed word is at pr, pc. Intersection at pr, pc+j
                                    # new word (down) would start at (pr-i), (pc+j)
                                    r = placed_word['row'] - i
                                    c = placed_word['col'] + j
                                    if 0 <= r and r + len(word) <= self.height:
                                        potential_spots.append((r, c, 'down'))
                                else: # placed is down
                                    # Intersection at pr+j, pc
                                    # new word (across) starts at (pr+j), (pc-i)
                                    r = placed_word['row'] + j
                                    c = placed_word['col'] - i
                                    if 0 <= c and c + len(word) <= self.width:
                                        potential_spots.append((r, c, 'across'))
                
                random.shuffle(potential_spots)
                for r, c, ori in potential_spots:
                    if self.is_valid(word, r, c, ori):
                        self.place(word, r, c, ori)
                        self.words.append({**word_obj, 'row': r, 'col': c, 'orientation': ori})
                        current_words.append({**word_obj, 'row': r, 'col': c, 'orientation': ori})
                        placed = True
                        break
            
            if len(self.words) > len(best_layout):
                best_layout = list(self.words)
                if len(best_layout) == len(sorted_words):
                    break # Perfect fit
                    
        return best_layout

def build_crossword_layout(word_list):
    """
    Takes list of {'answer': 'X', 'clue': 'Y'} and calculates
    valid row/col coordinates for the HTML.
    """
    # Filter bad words
    clean_list = []
    for item in word_list:
        # Keep accents, just remove spaces/punctuation
        clean = item['answer'].upper().replace(" ", "").replace("-", "").replace("'", "")
        if 2 < len(clean) < 12:
            clean_list.append({**item, 'answer': clean})
            
    generator = CrosswordGenerator()
    layout = generator.generate(clean_list)
    
    if not layout:
        print("⚠️ Crossword generation failed. Sending empty grid.")
        return []

    return layout

def validate_data(data):
    """
    Validates the data to ensure consistency.
    Generates scrambled words for unjumble.
    """
    print(f"Validating data for {data['meta']['language']} - {data['meta']['topic']}...")
    
    # Basic validation to ensure keys exist
    required_keys = ['meta', 'vocab', 'crossword_words', 'matching', 'translation', 'unjumble_solutions', 'multiple_choice']
    for key in required_keys:
        if key not in data:
            print(f"Warning: Missing key '{key}' in data. Adding empty placeholder.")
            data[key] = []

    # Generate Unjumble (Python-side scrambling)
    data['unjumble'] = []
    vocab_targets = set(item['target'].lower() for item in data['vocab'])
    
    for solution in data['unjumble_solutions']:
        # Verify it's in vocab (optional, but good practice)
        # if solution.lower() not in vocab_targets:
        #     print(f"Warning: Unjumble word '{solution}' not in vocab.")
        
        # Scramble
        chars = list(solution)
        # Ensure it's actually scrambled
        attempts = 0
        while attempts < 5:
            random.shuffle(chars)
            scrambled = "".join(chars)
            if scrambled != solution:
                break
            attempts += 1
            
        data['unjumble'].append({"scrambled": scrambled, "solution": solution})

    # Shuffle Multiple Choice Options
    for mc in data.get('multiple_choice', []):
        if 'options' in mc and 'answer' in mc:
            # Shuffle options
            random.shuffle(mc['options'])
            # Ensure answer is still in options (it should be, but just in case AI hallucinated)
            if mc['answer'] not in mc['options']:
                # If answer lost (rare), pick the first option as answer
                mc['answer'] = mc['options'][0]

    return data

# --- SUPABASE FETCHING & GROUPING ---
def fetch_jobs_from_supabase():
    """
    Fetches vocabulary from centralized_vocabulary table and groups by curriculum level.
    Returns list of job dictionaries with 'topic', 'language', and 'vocab' keys.
    """
    print("📡 Fetching vocabulary from Supabase...")
    
    # Fetch ALL rows using pagination (Supabase default limit is 1000)
    all_rows = []
    page_size = 1000
    offset = 0
    
    while True:
        response = supabase.table("centralized_vocabulary").select(
            "language, word, translation, curriculum_level, category, subcategory, theme_name, unit_name"
        ).range(offset, offset + page_size - 1).execute()
        
        rows = response.data
        if not rows:
            break
            
        all_rows.extend(rows)
        print(f"   Fetched {len(all_rows)} rows...")
        
        if len(rows) < page_size:
            break
        offset += page_size
    
    print(f"   Total: {len(all_rows)} vocabulary items.")
    
    # Group words based on curriculum level
    ks3_groups = defaultdict(list)  # (language, category, subcategory) -> [words]
    ks4_groups = defaultdict(list)  # (language, theme_name, unit_name) -> [words]
    
    # Also group by topic_id or any available field for non-KS3/KS4 items
    other_groups = defaultdict(list)  # (language, category) -> [words] as fallback
    
    for row in all_rows:
        lang = row.get('language')
        word = row.get('word')
        translation = row.get('translation')
        level = row.get('curriculum_level')
        
        if not lang or not word or not translation:
            continue
        
        vocab_item = {"target": word, "english": translation}
        
        if level == "KS3":
            category = row.get('category')
            subcategory = row.get('subcategory')
            if category and subcategory:
                key = (lang, category, subcategory)
                ks3_groups[key].append(vocab_item)
            elif category:
                # Fallback: just use category if no subcategory
                key = (lang, "KS3", category)
                other_groups[key].append(vocab_item)
        
        elif level == "KS4":
            theme = row.get('theme_name')
            unit = row.get('unit_name')
            if theme and unit:
                key = (lang, theme, unit)
                ks4_groups[key].append(vocab_item)
            elif theme:
                # Fallback: just use theme if no unit
                key = (lang, "KS4", theme)
                other_groups[key].append(vocab_item)
        
        else:
            # No curriculum level - use category as fallback
            category = row.get('category') or row.get('theme_name') or 'General'
            subcategory = row.get('subcategory') or row.get('unit_name') or 'Vocabulary'
            key = (lang, category, subcategory)
            other_groups[key].append(vocab_item)
    
    # Build job list
    jobs = []
    
    for (lang, category, subcategory), vocab_list in ks3_groups.items():
        if len(vocab_list) >= 8:  # Lowered minimum for more results
            topic = f"KS3: {category} - {subcategory}"
            full_language = LANGUAGE_MAP.get(lang, lang.capitalize())
            jobs.append({
                "topic": topic,
                "language": lang,
                "language_full": full_language,
                "vocab": vocab_list,
                "display_name": f"[{lang.upper()}] {topic}"
            })
    
    for (lang, theme, unit), vocab_list in ks4_groups.items():
        if len(vocab_list) >= 8:  # Lowered minimum
            topic = f"KS4: {theme} - {unit}"
            full_language = LANGUAGE_MAP.get(lang, lang.capitalize())
            jobs.append({
                "topic": topic,
                "language": lang,
                "language_full": full_language,
                "vocab": vocab_list,
                "display_name": f"[{lang.upper()}] {topic}"
            })
    
    for (lang, category, subcategory), vocab_list in other_groups.items():
        if len(vocab_list) >= 8:  # Lowered minimum
            topic = f"{category} - {subcategory}"
            full_language = LANGUAGE_MAP.get(lang, lang.capitalize())
            jobs.append({
                "topic": topic,
                "language": lang,
                "language_full": full_language,
                "vocab": vocab_list,
                "display_name": f"[{lang.upper()}] {topic}"
            })
    
    # Sort jobs by language then topic
    jobs.sort(key=lambda x: (x['language'], x['topic']))
    
    print(f"   Created {len(jobs)} worksheet jobs.")
    return jobs

# --- 3. ASYNC PROCESSOR ---
async def process_job(job):
    """
    Process a job dictionary containing topic, language, and pre-fetched vocab.
    Generates AI-enhanced content and renders PDFs.
    """
    topic = job['topic']
    language_full = job['language_full']
    vocab_list = job['vocab']
    
    # Format the topic title nicely
    formatted_topic = format_topic_title(topic)
    
    print(f"🚀 Starting: [{job['language'].upper()}] {formatted_topic}")
    
    try:
        # Build a condensed vocab string for the AI
        vocab_sample = vocab_list[:15] if len(vocab_list) >= 15 else vocab_list
        vocab_str = ", ".join([f"{v['target']} ({v['english']})" for v in vocab_sample])
        
        # AI generates supplementary content (crossword clues, multiple choice, etc.)
        ai_prompt = f"""
Topic: {language_full} - {formatted_topic}
Use ONLY these vocabulary words: {vocab_str}

Generate worksheet content using ONLY the provided vocabulary.
"""
        
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": ai_prompt}
            ],
            response_format={"type": "json_object"}
        )
        raw_data = json.loads(response.choices[0].message.content)
        
        # Override vocab with database vocab (AI may have slightly modified it)
        raw_data['vocab'] = vocab_sample
        raw_data['meta'] = {"topic": formatted_topic, "language": language_full}
        
        # Validate
        data = validate_data(raw_data)
        
        # B. COMPUTE GEOMETRY (Python does this, not AI)
        data['crossword_layout'] = build_crossword_layout(data.get('crossword_words', []))
        
        # C. RENDER (The "Print Twice" Strategy)
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Load Template
            script_dir = os.path.dirname(os.path.abspath(__file__))
            template_path = os.path.join(script_dir, "template.html")
            await page.goto(f"file://{template_path}")
            
            # 1. Inject Data (Generates Random Grids in JS)
            await page.evaluate(f"renderData({json.dumps(data)}, false)")
            await page.wait_for_timeout(1000)
            
            # 2. Print STUDENT Version to temp file
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            safe_name = f"{job['language']}_{formatted_topic.replace(' ', '_').replace(':', '').replace('-', '_')}"
            student_pdf = f"{OUTPUT_DIR}/{safe_name}_student_temp.pdf"
            await page.pdf(path=student_pdf, format="A4", print_background=True)
            
            # 3. REVEAL ANSWERS
            await page.evaluate(f"renderData({json.dumps(data)}, true)")
            await page.wait_for_timeout(500)
            answers_pdf = f"{OUTPUT_DIR}/{safe_name}_answers_temp.pdf"
            await page.pdf(path=answers_pdf, format="A4", print_background=True)
            
            await browser.close()
        
        # 4. COMBINE both PDFs into one file
        from pypdf import PdfReader, PdfWriter
        
        writer = PdfWriter()
        
        # Add student pages
        student_reader = PdfReader(student_pdf)
        for page_obj in student_reader.pages:
            writer.add_page(page_obj)
        
        # Add answer pages
        answers_reader = PdfReader(answers_pdf)
        for page_obj in answers_reader.pages:
            writer.add_page(page_obj)
        
        # Write combined PDF
        combined_path = f"{OUTPUT_DIR}/{safe_name}.pdf"
        with open(combined_path, "wb") as f:
            writer.write(f)
        
        # Clean up temp files
        os.remove(student_pdf)
        os.remove(answers_pdf)
        
        print(f"   ✅ Saved: {combined_path} (worksheet + answers)")
            
        return True

    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

async def process_topic(topic_description):
    """Legacy function for processing simple topic strings (kept for compatibility)."""
    print(f"🚀 Starting: {topic_description}")
    try:
        # A. GENERATE
        response = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Topic: {topic_description}"}
            ],
            response_format={"type": "json_object"}
        )
        raw_data = json.loads(response.choices[0].message.content)
        
        # Validate
        data = validate_data(raw_data)
        
        # B. COMPUTE GEOMETRY (Python does this, not AI)
        data['crossword_layout'] = build_crossword_layout(data.get('crossword_words', []))
        
        # C. RENDER (The "Print Twice" Strategy)
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Load Template
            script_dir = os.path.dirname(os.path.abspath(__file__))
            template_path = os.path.join(script_dir, "template.html")
            await page.goto(f"file://{template_path}")
            
            # 1. Inject Data (Generates Random Grids in JS)
            # We pass 'false' for showAnswers initially
            await page.evaluate(f"renderData({json.dumps(data)}, false)")
            await page.wait_for_timeout(1000) # Wait for grids
            
            # 2. Print STUDENT Version
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            safe_name = f"{data['meta']['language']}_{data['meta']['topic'].replace(' ', '_')}"
            await page.pdf(path=f"{OUTPUT_DIR}/{safe_name}.pdf", format="A4", print_background=True)
            print(f"Saved PDF to: {OUTPUT_DIR}/{safe_name}.pdf")
            
            # 3. REVEAL ANSWERS (Without reloading page!)
            # This ensures the Word Search grid stays exactly the same
            await page.evaluate(f"renderData({json.dumps(data)}, true)")
            
            await page.wait_for_timeout(500)
            await page.pdf(path=f"{OUTPUT_DIR}/{safe_name}_Answers.pdf", format="A4", print_background=True)
            print(f"Saved PDF to: {OUTPUT_DIR}/{safe_name}_Answers.pdf")
            
            await browser.close()

    except Exception as e:
        print(f"❌ Error on {topic_description}: {e}")

def simple_menu():
    """Run the interactive menu (synchronous) and return selected jobs."""
    print("\n" + "="*60)
    print("🎓 SecondaryMFL Worksheet Factory")
    print("="*60 + "\n")
    
    # Step 1: Fetch all jobs from database
    all_jobs = fetch_jobs_from_supabase()
    
    if not all_jobs:
        print("❌ No worksheet jobs found in database. Exiting.")
        return []
    
    # Get unique languages
    languages = sorted(set(j['language'] for j in all_jobs))
    lang_display = ['ALL'] + [f"{LANGUAGE_MAP.get(l, l.capitalize())} ({l})" for l in languages]
    
    # Step 2: Language Filter
    language_choice = questionary.select(
        "Select Language:",
        choices=lang_display
    ).ask()
    
    if not language_choice:
        print("❌ No language selected. Exiting.")
        return []
    
    # Filter jobs by language
    if language_choice == 'ALL':
        filtered_jobs = all_jobs
    else:
        # Extract language code from selection (e.g., "French (fr)" -> "fr")
        lang_code = language_choice.split('(')[1].replace(')', '').strip()
        filtered_jobs = [j for j in all_jobs if j['language'] == lang_code]
    
    if not filtered_jobs:
        print(f"❌ No jobs found for {language_choice}. Exiting.")
        return []
    
    print(f"\n📋 Found {len(filtered_jobs)} topics for {language_choice}\n")
    
    # Step 3: Show selection mode
    selection_mode = questionary.select(
        "How would you like to select topics?",
        choices=[
            "Generate ALL topics (full batch)",
            "Search by keyword",
            "Select one topic (quick generate)",
            "Select by curriculum level (KS3/KS4)",
            "Browse and multi-select (paginated)"
        ]
    ).ask()
    
    if not selection_mode:
        return []
    
    selected_jobs = []
    
    if "ALL" in selection_mode:
        # Generate all
        confirm = questionary.confirm(
            f"This will generate {len(filtered_jobs)} worksheets. Continue?"
        ).ask()
        if confirm:
            selected_jobs = filtered_jobs
    
    elif "Search" in selection_mode:
        # Search by keyword
        keyword = questionary.text("Enter keyword to search:").ask()
        if keyword:
            keyword = keyword.lower()
            matching = [j for j in filtered_jobs if keyword in j['display_name'].lower()]
            if matching:
                print(f"\n🔍 Found {len(matching)} matching topics:\n")
                # Use select for single choice, or show list and confirm all
                if len(matching) == 1:
                    selected_jobs = matching
                    print(f"   → {matching[0]['display_name']}")
                else:
                    choices = [j['display_name'] for j in matching]
                    choices.append("✅ Generate ALL matching")
                    choice = questionary.select(
                        "Select a topic:",
                        choices=choices
                    ).ask()
                    if choice == "✅ Generate ALL matching":
                        selected_jobs = matching
                    elif choice:
                        selected_jobs = [j for j in matching if j['display_name'] == choice]
            else:
                print(f"❌ No topics matching '{keyword}'")
    
    elif "one topic" in selection_mode:
        # Quick single select - paginated for large lists
        if len(filtered_jobs) > 30:
            # Show a search first for large lists
            keyword = questionary.text(
                f"Enter keyword to narrow down {len(filtered_jobs)} topics (or press Enter to browse all):"
            ).ask()
            
            if keyword and keyword.strip():
                keyword = keyword.lower()
                filtered = [j for j in filtered_jobs if keyword in j['display_name'].lower()]
                if filtered:
                    print(f"🔍 Found {len(filtered)} matching topics")
                    choices = [j['display_name'] for j in filtered]
                else:
                    print(f"No matches for '{keyword}', showing all...")
                    choices = [j['display_name'] for j in filtered_jobs]
            else:
                choices = [j['display_name'] for j in filtered_jobs]
        else:
            choices = [j['display_name'] for j in filtered_jobs]
        
        choice = questionary.select(
            "Select a topic to generate:",
            choices=choices
        ).ask()
        if choice:
            selected_jobs = [j for j in filtered_jobs if j['display_name'] == choice]
    
    elif "curriculum" in selection_mode:
        # Select by KS level
        level = questionary.select(
            "Select curriculum level:",
            choices=["KS3", "KS4", "Other"]
        ).ask()
        if level:
            if level == "Other":
                matching = [j for j in filtered_jobs if not j['topic'].startswith('KS3') and not j['topic'].startswith('KS4')]
            else:
                matching = [j for j in filtered_jobs if j['topic'].startswith(level)]
            
            if matching:
                print(f"\n📚 Found {len(matching)} {level} topics")
                sub_mode = questionary.select(
                    "What would you like to do?",
                    choices=[
                        f"Generate ALL {len(matching)} {level} topics",
                        "Select one topic",
                        "Search within these topics"
                    ]
                ).ask()
                
                if "ALL" in sub_mode:
                    confirm = questionary.confirm(
                        f"This will generate {len(matching)} worksheets. Continue?"
                    ).ask()
                    if confirm:
                        selected_jobs = matching
                elif "one" in sub_mode:
                    choices = [j['display_name'] for j in matching]
                    choice = questionary.select(
                        "Select a topic:",
                        choices=choices
                    ).ask()
                    if choice:
                        selected_jobs = [j for j in matching if j['display_name'] == choice]
                elif "Search" in sub_mode:
                    keyword = questionary.text("Enter keyword:").ask()
                    if keyword:
                        keyword = keyword.lower()
                        found = [j for j in matching if keyword in j['display_name'].lower()]
                        if found:
                            choices = [j['display_name'] for j in found]
                            choice = questionary.select(
                                f"Found {len(found)} matches:",
                                choices=choices
                            ).ask()
                            if choice:
                                selected_jobs = [j for j in found if j['display_name'] == choice]
            else:
                print(f"❌ No {level} topics found")
    
    else:
        # Browse paginated with multi-select
        PAGE_SIZE = 20
        total_pages = (len(filtered_jobs) + PAGE_SIZE - 1) // PAGE_SIZE
        
        print(f"\n📖 Browsing {len(filtered_jobs)} topics ({total_pages} pages)")
        print("   💡 TIP: Press SPACE to select items, then ENTER to confirm\n")
        
        all_selected = []
        page = 0
        
        while True:
            start_idx = page * PAGE_SIZE
            end_idx = min(start_idx + PAGE_SIZE, len(filtered_jobs))
            page_jobs = filtered_jobs[start_idx:end_idx]
            
            # Build choices with pre-selected items marked
            choices = []
            if page > 0:
                choices.append(questionary.Choice("⬅️  Previous page", checked=False))
            
            for j in page_jobs:
                is_selected = j['display_name'] in all_selected
                choices.append(questionary.Choice(j['display_name'], checked=is_selected))
            
            if end_idx < len(filtered_jobs):
                choices.append(questionary.Choice("➡️  Next page", checked=False))
            choices.append(questionary.Choice("✅ DONE - Generate selected", checked=False))
            choices.append(questionary.Choice("❌ Cancel", checked=False))
            
            print(f"\n--- Page {page + 1}/{total_pages} | Selected so far: {len(all_selected)} ---")
            
            result = questionary.checkbox(
                f"SPACE=toggle, ENTER=continue:",
                choices=choices
            ).ask()
            
            if not result or "Cancel" in result:
                all_selected = []
                break
            
            # Process selections from this page
            for item in result:
                if item in ["⬅️  Previous page", "➡️  Next page", "✅ DONE - Generate selected", "❌ Cancel"]:
                    continue
                if item not in all_selected:
                    all_selected.append(item)
            
            # Remove deselected items from this page
            page_names = [j['display_name'] for j in page_jobs]
            for name in page_names:
                if name in all_selected and name not in result:
                    all_selected.remove(name)
            
            # Handle navigation
            if "⬅️  Previous page" in result:
                page = max(0, page - 1)
            elif "➡️  Next page" in result:
                page = min(total_pages - 1, page + 1)
            elif "✅ DONE - Generate selected" in result:
                break
        
        selected_jobs = [j for j in filtered_jobs if j['display_name'] in all_selected]
    
    return selected_jobs

async def main():
    # Run the synchronous menu
    selected_jobs = simple_menu()
    
    if not selected_jobs:
        print("❌ No topics selected. Exiting.")
        return
    
    print(f"\n🚀 Generating {len(selected_jobs)} worksheets...\n")
    
    # Process selected jobs (batch with concurrency limit)
    semaphore = asyncio.Semaphore(3)  # Limit concurrent processing
    
    async def process_with_semaphore(job):
        async with semaphore:
            return await process_job(job)
    
    results = await asyncio.gather(*(process_with_semaphore(j) for j in selected_jobs))
    
    # Summary
    success_count = sum(1 for r in results if r)
    print(f"\n" + "="*60)
    print(f"✅ Completed: {success_count}/{len(selected_jobs)} worksheets generated")
    print(f"📁 Output folder: {OUTPUT_DIR}/")
    print("="*60 + "\n")

if __name__ == "__main__":
    # Run the synchronous menu first (before asyncio event loop starts)
    selected_jobs = simple_menu()
    
    if not selected_jobs:
        print("❌ No topics selected. Exiting.")
    else:
        # Now run the async processing
        async def run_jobs():
            print(f"\n🚀 Generating {len(selected_jobs)} worksheets...\n")
            
            # Process selected jobs (batch with concurrency limit)
            semaphore = asyncio.Semaphore(3)  # Limit concurrent processing
            
            async def process_with_semaphore(job):
                async with semaphore:
                    return await process_job(job)
            
            results = await asyncio.gather(*(process_with_semaphore(j) for j in selected_jobs))
            
            # Summary
            success_count = sum(1 for r in results if r)
            print(f"\n" + "="*60)
            print(f"✅ Completed: {success_count}/{len(selected_jobs)} worksheets generated")
            print(f"📁 Output folder: {OUTPUT_DIR}/")
            print("="*60 + "\n")
        
        asyncio.run(run_jobs())
