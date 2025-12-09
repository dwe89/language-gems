import os
import json
import asyncio
import random
import re
import logging
from typing import Dict, List, Any, Optional
from openai import AsyncOpenAI
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from supabase import create_client, Client
import questionary
from collections import defaultdict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv('.env.local')

API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not API_KEY or not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing API keys in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = AsyncOpenAI(api_key=API_KEY)

MODEL_NAME = "gpt-4.1-nano"
OUTPUT_DIR = "output/gcse"

# Constants for worksheet generation
BATCH_SIZE = 15
MIN_WORDS_FOR_WORKSHEET = 1  # Changed to 1 to allow small last batches
MAX_SENTENCE_LENGTH = 40  # Reduced to 40 to prevent line wrapping
READING_TEXT_WORD_COUNT = 150

# Names for activities
NAMES_BY_LANG = {
    'fr': ['Pierre', 'Marie', 'Sophie', 'Thomas', 'Lucas', 'Camille', 'Léa', 'Nicolas', 'Julien', 'Chloé'],
    'es': ['María', 'Carlos', 'Ana', 'Juan', 'Sofía', 'Luis', 'Elena', 'Diego', 'Carmen', 'Pablo'],
    'de': ['Hans', 'Anna', 'Lukas', 'Julia', 'Maximilian', 'Lena', 'Felix', 'Sarah', 'Paul', 'Lisa']
}

# Starting phrases to force language
START_PHRASES = {
    'fr': "Bonjour, je m'appelle {name}.",
    'es': "Hola, me llamo {name}.",
    'de': "Hallo, ich heiße {name}."
}

# Language mapping
LANGUAGE_MAP = {
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German'
}

NATIVE_LANGUAGE_MAP = {
    'fr': 'FRANÇAIS (FRENCH)',
    'es': 'ESPAÑOL (SPANISH)',
    'de': 'DEUTSCH (GERMAN)'
}

SYSTEM_PROMPT = """
You are an expert AQA/Edexcel GCSE Modern Foreign Languages Exam Writer.
You create rigorous, exam-focused worksheet content that follows UK GCSE examination standards.

CRITICAL RULES:
1. You MUST use ONLY the provided TARGET WORD SET (TWS) for vocabulary content.
2. Do NOT introduce complex vocabulary outside of the TWS.
3. Simple connectives (et, y, und, mais, pero, aber) are acceptable.
4. All content must be age-appropriate for 14-16 year olds.
5. Sentences must be grammatically correct and natural-sounding.
6. Output ONLY valid JSON matching the exact schema provided.
7. All sentences should be concise (under 45 characters where specified).
8. Reading texts MUST feature a NAMED CHARACTER - use the one provided in the prompt.
9. Reading comprehension questions follow SEQUENTIAL ORDER matching the text flow.
10. Questions are FACT-RETRIEVAL based - targeting specific phrases students must find and translate.
"""

class GCSEWorksheetGenerator:
    """Generates GCSE-style language worksheets with multiple activity types."""
    
    def __init__(self):
        self.max_retries = 3
        self.retry_delay = 2

    async def verify_response(self, data: Dict[str, Any], job: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends the generated data back to AI to check for errors and fix them.
        """
        logger.info("Verifying and refining content with AI...")
        
        verification_prompt = f"""
You are a Quality Assurance Editor for a GCSE {LANGUAGE_MAP.get(job['language'], job['language'])} worksheet.
Review the provided JSON content and FIX any errors.

CRITICAL CHECKS:

1. ACTIVITY 4 (GAP FILL):
   - The 'target_word' MUST fit grammatically into the 'sentence' gap EXACTLY as written.
   - **Check for Infinitive Verbs:** If the word is an infinitive (e.g., "costar", "manger"), the sentence MUST use a structure that allows an infinitive (e.g., "Va a costar...", "Il faut manger...").
     - ERROR: "La comida costar mucho." (Wrong)
     - FIX: "La comida va a costar mucho." (Correct)
   - **Check for Adjectives:** Ensure gender/number agreement matches the EXACT word in the list.
     - ERROR: Word="rojo", Sentence="La casa es _______." (Wrong, needs 'roja')
     - FIX: "El coche es _______." (Correct, fits 'rojo')
   - **Check for Prepositions:** Ensure no double prepositions.
     - ERROR: "Voy a _______" (if word is "el club") -> "Voy a el club" (Wrong)
     - FIX: "Visito _______" (Correct)
     - **Check for Articles:** If the target word has an article (e.g. "el arte"), the sentence MUST contain the full string "el arte".
     - ERROR: Target="el arte", Sentence="Hay mucho arte." (Missing 'el').
     - FIX: Rewrite sentence -> "El arte es interesante."
     - **Check for Exact Match:** The target word MUST appear EXACTLY in the sentence.
     - ERROR: Target="deportivo", Sentence="Llevo ropa deportiva." (Mismatch: 'deportiva' != 'deportivo').
     - FIX: Rewrite sentence -> "El coche deportivo es rápido." (Matches 'deportivo').

2. ACTIVITY 8 (TRUE/FALSE):
   - **CRITICAL LANGUAGE CHECK:**
     - The Reading Text MUST be in {LANGUAGE_MAP.get(job['language'], job['language'])}.
     - The Statements MUST be in ENGLISH.
     - If the text is in English -> TRANSLATE to {LANGUAGE_MAP.get(job['language'], job['language'])}.
     - If the statements are in {LANGUAGE_MAP.get(job['language'], job['language'])} -> TRANSLATE to ENGLISH.

3. ACTIVITY 6 (TRANSLATION):
   - Ensure target sentences are natural and not literal translations.
   - Ensure infinitives are preserved in target sentences.

4. GENERAL:
   - Ensure no empty fields.
   - **CRITICAL:** Check Activity 7 and 8. If any question or statement asks "What is his/her name?" or "His name is...", REPLACE IT.
     - The name is already known. Ask about something else (age, hobby, family).
   - **CRITICAL:** Check Activity 7 (Reading Comprehension) Questions & Answers:
     - Ensure the Question Word matches the Answer Type.
     - "Where..." -> Answer MUST be a place/location. (Wrong: "Where does he ride?" -> "He rides his bike." Correct: "Where..." -> "In the park.")
     - "When..." -> Answer MUST be a time/frequency.
     - "Who..." -> Answer MUST be a person.
     - If "Where does he ride?" is answered with "His bike", CHANGE the question to "What does he ride?".
     - **NO YES/NO ANSWERS:**
       - If an answer is "Yes", "No", "Si", "Non", etc., YOU MUST REWRITE THE QUESTION.
       - ERROR: "Is Luis tired?" -> "No"
       - FIX: "How does Luis feel?" -> "He is energetic" (or whatever matches text).
       - ERROR: "Does he like singing?" -> "Yes"
       - FIX: "What does he like doing?" -> "He likes singing."
     - **CRITICAL LANGUAGE CHECK:**
       - Questions MUST be in ENGLISH.
       - Answers MUST be in ENGLISH.
       - The Text MUST be in {LANGUAGE_MAP.get(job['language'], job['language'])}.
       - If any are wrong, TRANSLATE THEM.

5. ACTIVITY 5 (SPOT THE MISTAKES):
   - **CRITICAL:** The 'incorrect' sentence MUST be different from the 'correct' sentence.
   - If they are the same, INTRODUCE A GRAMMATICAL ERROR in the 'incorrect' version (e.g., wrong gender, wrong verb ending).

6. TEXT CONSISTENCY (Activity 7 & 8):
   - Check the character's gender. (Elena = Female, Pablo = Male).
   - Ensure all adjectives agreeing with the narrator match this gender.
   - ERROR: "Me llamo Elena. Soy serio." (Wrong) -> FIX: "Soy seria."

7. ACTIVITY 4 (GAP FILL):
   - Ensure the target word does NOT appear elsewhere in the sentence.
   - ERROR: Sentence="Ella es _____ y optimista", Target="optimista". (Result: "Ella es optimista y optimista").
   - FIX: Change the OTHER adjective. -> "Ella es feliz y optimista."

155: Return the CORRECTED JSON object.
156: **CRITICAL: DO NOT DELETE ANY CONTENT.** If a section is correct, return it EXACTLY as is.
157: **CRITICAL: DO NOT RETURN EMPTY FIELDS.**
158: """
        
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a helpful AI editor."},
                    {"role": "user", "content": verification_prompt},
                    {"role": "user", "content": json.dumps(data)}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,  # Low temperature for strict correction
                max_tokens=4000
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Verification failed: {e}")
            return data # Return original if verification fails

    async def repair_gap_fill(self, data: Dict[str, Any], valid_words: List[str]) -> Dict[str, Any]:
        """
        Checks Gap Fill sentences for:
        1. Exact word matches in the sentence.
        2. Validity of the target word (must be in valid_words).
        """
        sentences = data.get('gap_fill_sentences', [])
        bad_indices = []
        
        # Normalize valid words for comparison
        valid_words_lower = [w.lower() for w in valid_words]
        
        for i, item in enumerate(sentences):
            target = item['target_word']
            sentence = item['sentence']
            
            # ERROR 1: Target word is not in the valid word bank
            if target.lower() not in valid_words_lower:
                bad_indices.append(i)
                continue

            # ERROR 2: Target word is not in the sentence exactly
            if target.lower() not in sentence.lower():
                bad_indices.append(i)
        
        if not bad_indices:
            return data
            
        logger.warning(f"Found {len(bad_indices)} bad Gap Fill sentences. Repairing...")
        
        # Construct repair prompt
        bad_items = [sentences[i] for i in bad_indices]
        valid_words_str = ", ".join(valid_words)
        
        repair_prompt = f"""
You are fixing broken sentences for a Gap Fill activity.
The Constraint: 
1. The 'target_word' MUST be one of these valid words: {valid_words_str}
2. The sentence MUST contain the 'target_word' EXACTLY as written.

You failed to do this for the following items:

{json.dumps(bad_items, indent=2)}

ERRORS FOUND:
- You might have used a word NOT in the list.
- You might have changed the word form (e.g. 'blanco' -> 'blanca').
- You might have dropped the article (e.g. 'el arte' -> 'arte').

YOUR TASK:
Fix each item.
1. Ensure 'target_word' is from the valid list: {valid_words_str}
   - If the current target_word is invalid, pick the closest match from the valid list.
2. Rewrite the 'sentence' so it contains that EXACT target_word.

Return ONLY a JSON object with the fixed items:
{{
    "fixed_items": [
        {{ "sentence": "New sentence", "target_word": "valid_word_from_list" }},
        ...
    ]
}}
"""
        try:
            response = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are a strict editor."},
                    {"role": "user", "content": repair_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            result = json.loads(response.choices[0].message.content)
            fixed_items = result.get('fixed_items', [])
            
            # Apply fixes
            for fixed in fixed_items:
                # Find which item this corresponds to (by target_word)
                for idx in bad_indices:
                    if sentences[idx]['target_word'] == fixed['target_word']:
                        sentences[idx]['sentence'] = fixed['sentence']
                        logger.info(f"Repaired: {fixed['target_word']} -> {fixed['sentence']}")
                        break
            
            data['gap_fill_sentences'] = sentences
            return data
            
        except Exception as e:
            logger.error(f"Gap Fill Repair failed: {e}")
            return data

    async def generate(self, job: Dict[str, Any], batch_num: int, total_batches: int) -> Optional[str]:
        """
        Generates a GCSE Mastery Worksheet (New Layout - 2 Pages).
        """
        tws = job['vocab']  # This is now the specific batch
        
        if not tws:
            logger.error(f"Insufficient vocabulary")
            return None
        
        # CLEAN VOCABULARY: Keep only the first part before '|' and normalize
        cleaned_tws = []
        for w in tws:
            clean_w = w.copy()
            # Clean translation - take first option before pipe
            if w.get('translation') and '|' in w['translation']:
                clean_w['translation'] = w['translation'].split('|')[0].strip()
            # Clean word - remove any extra whitespace
            if w.get('word'):
                clean_w['word'] = w['word'].strip()
            # Ensure part_of_speech exists
            if not clean_w.get('part_of_speech'):
                clean_w['part_of_speech'] = 'unknown'
            cleaned_tws.append(clean_w)
        
        # Update job vocab with cleaned version
        job['vocab'] = cleaned_tws
            
        tws_str = "\n".join([f"- {w['word']} ({w['translation']}) [{w['part_of_speech']}]" for w in cleaned_tws])
        
        print(f"   🚀 Generating Batch {batch_num}/{total_batches}: {len(tws)} words")

        # --- PRE-PROCESSING: Select words for specific activities ---
        # This ensures we use real words from the DB and don't rely on AI hallucination for key vocabulary
        
        # 1. Unjumble: Select 8 words
        unjumble_words = random.sample(job['vocab'], min(8, len(job['vocab'])))
        job['unjumble_words'] = unjumble_words
        
        # 2. Gap Fill: Select 6 words
        # Try to pick words that haven't been used in Unjumble if possible, but overlap is okay
        remaining_vocab = [w for w in job['vocab'] if w not in unjumble_words]
        if len(remaining_vocab) < 6:
            # If not enough remaining, sample from full vocab
            gap_fill_words = random.sample(job['vocab'], min(6, len(job['vocab'])))
        else:
            gap_fill_words = random.sample(remaining_vocab, 6)
            
        # Ensure exactly 6 words by duplicating if necessary (for very small vocab sets)
        while len(gap_fill_words) < 6:
            gap_fill_words.append(random.choice(gap_fill_words))
            
        gap_fill_word_list = [w['word'] for w in gap_fill_words]
        job['gap_fill_word_list'] = gap_fill_word_list

        # 3. Translation Gaps: Select 4 words
        # Try to avoid gap fill words
        available_for_trans = [w for w in job['vocab'] if w not in gap_fill_words]
        if len(available_for_trans) < 4:
            translation_words = random.sample(job['vocab'], min(4, len(job['vocab'])))
            # Ensure 4
            while len(translation_words) < 4:
                translation_words.append(random.choice(translation_words))
        else:
            translation_words = random.sample(available_for_trans, 4)
        translation_word_list = [w['word'] for w in translation_words]
        job['translation_word_list'] = translation_word_list

        # 4. Choose Correct: Select 8 words max (Python Generated)
        choose_correct_words = random.sample(job['vocab'], min(8, len(job['vocab'])))
        
        # Generate Q2 Data in Python (No AI needed)
        choose_correct_data = []
        for target_word in choose_correct_words:
            correct_option = target_word['word']
            # Pick 2 distractors from other words
            other_words = [w['word'] for w in job['vocab'] if w['word'] != correct_option]
            if len(other_words) >= 2:
                distractors = random.sample(other_words, 2)
            else:
                distractors = other_words  # Use what we have
            options = [correct_option] + distractors
            random.shuffle(options)
            
            choose_correct_data.append({
                "english": target_word['translation'],  # The prompt is the English meaning
                "options": options,
                "correct": correct_option
            })

        # Build detailed vocabulary reference for AI
        vocab_with_translations = "\n".join([
            f"  • {w['word']} = {w['translation']} ({w['part_of_speech']})" 
            for w in job['vocab']
        ])
        
        # Select random names
        lang_code = job['language'] if job['language'] in NAMES_BY_LANG else 'es'
        name_1 = random.choice(NAMES_BY_LANG[lang_code])
        name_2 = random.choice([n for n in NAMES_BY_LANG[lang_code] if n != name_1])
        
        # Get start phrase
        start_phrase = START_PHRASES.get(lang_code, f"My name is {name_2}.").format(name=name_2)
        native_lang_name = NATIVE_LANGUAGE_MAP.get(lang_code, job['language'].upper())

        # Construct improved Prompt with clearer instructions
        prompt = f"""
Create educational content for a GCSE {LANGUAGE_MAP.get(job['language'], job['language'])} worksheet.

CONTEXT:
- Language: {LANGUAGE_MAP.get(job['language'], job['language'])}
- Topic: {job['theme']} - {job['unit']}
- Tier: {job['tier'].capitalize()}
- Student Age: 14-16 years old

TARGET VOCABULARY (You MUST use these words):
{vocab_with_translations}

REQUIRED OUTPUT - Generate all activities below:

═══════════════════════════════════════════════════════════════
ACTIVITY 1: MATCH UP (15 items)
═══════════════════════════════════════════════════════════════
Create vocabulary matching pairs using ALL {len(job['vocab'])} words from the target vocabulary.
Each pair: target language word → English translation

═══════════════════════════════════════════════════════════════
ACTIVITY 4: GAP FILL SENTENCES (6 sentences)
═══════════════════════════════════════════════════════════════
**YOU MUST CREATE EXACTLY 6 SENTENCES.**
MANDATORY WORDS (create ONE sentence for EACH): {', '.join(gap_fill_word_list)}

Requirements:
- Create exactly 6 sentences.
- Each sentence MUST contain the MANDATORY WORD exactly as listed.
- **CRITICAL: GRAMMATICAL AGREEMENT & ARTICLES**
  - You must construct the sentence so that the **EXACT** word from the list fits grammatically.
  - **DO NOT CHANGE THE WORD FORM.** If the word is "deportivo", you MUST use "deportivo". Do NOT use "deportiva", "deportivos", etc.
  - If the word doesn't fit your sentence, **CHANGE THE SENTENCE**.
  - Example: Word="deportivo".
    - WRONG: "Llevo ropa deportiva." (Changed word to feminine).
    - CORRECT: "Tengo un coche deportivo." (Kept word masculine).
  - **IF THE WORD HAS AN ARTICLE (e.g. 'el arte', 'la casa'), YOU MUST KEEP IT.**
  - DO NOT create sentences where the article would be dropped or merged (e.g. "del", "al", "du", "mucho arte").
  - INSTEAD, use the word as a Subject or Direct Object where the article is natural and separate.
  - Example: Word="el arte".
    - BAD: "Hay mucho arte." (Article 'el' is missing).
    - BAD: "Voy al arte." ('a' + 'el' merged).
    - GOOD: "El arte es bonito." (Subject).
    - GOOD: "Me gusta el arte." (Object).
  - Use verbs/structures that take a DIRECT OBJECT or SUBJECT to avoid contraction issues.
- Maximum 40 characters per sentence.
- Use simple, present tense.

═══════════════════════════════════════════════════════════════
ACTIVITY 5: SPOT THE MISTAKES (4 sentences)
═══════════════════════════════════════════════════════════════
Create 4 sentences, each with EXACTLY ONE grammatical error.
**CRITICAL: The 'incorrect' sentence MUST be DIFFERENT from the 'correct' version.**
Error types to include (vary them):
- Gender agreement errors (e.g., "la libro" instead of "el libro")
- Verb conjugation errors (e.g., "je mange" vs "je manges")
- Adjective agreement (e.g., "une grande maison" vs "un grand maison")
- Article errors

DO NOT use:
- Missing accents as errors
- Spelling typos
- Multiple errors per sentence

═══════════════════════════════════════════════════════════════
ACTIVITY 6: TRANSLATION GAPS (4 pairs)
═══════════════════════════════════════════════════════════════
Create 4 English→{LANGUAGE_MAP.get(job['language'], job['language'])} translation pairs.
MANDATORY words to include: {', '.join(translation_word_list)}

CRITICAL REQUIREMENTS:
- English sentence: Simple, 4-8 words.
- Target translation: The FULL correct sentence in {LANGUAGE_MAP.get(job['language'], job['language'])}.
- target_word: The KEY VOCABULARY WORD that will be BLANKED OUT.
- **CRITICAL: IDIOMATIC TRANSLATION**
  - Do NOT translate literally word-for-word. Use natural phrasing.
  - Example: "It is hot" -> "Hace calor" (NOT "Es caliente").
- **CRITICAL: VERB HANDLING**
  - If the target_word is a VERB (infinitive), you **MUST** use a sentence structure that keeps it in the INFINITIVE.
  - Use structures like: "Me gusta...", "Voy a...", "Quiero...", "Es importante...".
  - WRONG: Target="compartir", Sentence="Comparten comida." (Verb is conjugated!)
  - CORRECT: Target="compartir", Sentence="Nos gusta compartir comida." (Verb matches infinitive!)

EXAMPLE (Correct):
- english: "She is German."
- target: "Ella es alemana."
- target_word: "alemana"

═══════════════════════════════════════════════════════════════
ACTIVITY 7: READING COMPREHENSION (AQA/Edexcel Exam Style)
═══════════════════════════════════════════════════════════════
**CRITICAL: YOU MUST WRITE EXACTLY 150-180 WORDS. COUNT THEM.**

Write a passage in {LANGUAGE_MAP.get(job['language'], job['language'])} about: {job['theme']} - {job['unit']}
USE CHARACTER NAME: {name_1}

TEXT REQUIREMENTS (MANDATORY - 150-180 WORDS MINIMUM):
- Can be written in FIRST PERSON ("I", "my") OR THIRD PERSON.
- Structure in 3 FULL paragraphs.
- Use vocabulary from the target list naturally.
- The text MUST be long enough to support 8 different questions.

QUESTION REQUIREMENTS (**EXACTLY 8 QUESTIONS** in ENGLISH):
- YOU MUST CREATE EXACTLY 8 QUESTIONS.
- Questions MUST follow CHRONOLOGICAL ORDER of the text.
- Use FACT-RETRIEVAL style: "What," "Where," "How," "Why" questions.
- ALWAYS use the character's NAME ({name_1}) in questions.
- **NO YES/NO QUESTIONS.** (e.g. "Does Elena like...?", "Is he...?" -> NO).
- **If the answer is "Yes" or "No", the question is WRONG.** Change it to "What", "How", "Why", etc.
- **NO TRICK QUESTIONS.**
- **CRITICAL: DO NOT ask what the character's name is.** (Since you must use the name in the question, asking for the name is stupid).

ADDITIONAL:
- For each question, provide an explicit "answer" field containing the expected answer IN ENGLISH.

═══════════════════════════════════════════════════════════════
ACTIVITY 8: TRUE/FALSE READING
═══════════════════════════════════════════════════════════════
**PART A: THE READING PASSAGE**
Write a DIFFERENT passage in **{native_lang_name}**.
**CRITICAL: THE TEXT MUST BE IN {native_lang_name}. DO NOT WRITE IT IN ENGLISH.**
**CRITICAL: YOU MUST START THE TEXT WITH THIS EXACT PHRASE:** "{start_phrase}"
**CRITICAL: The text must be MAX 420 CHARACTERS.**
Different content from Activity 7 but same vocabulary theme.

**PART B: THE STATEMENTS**
Create 10 True/False statements about the text above.
- Statements MUST be written in **ENGLISH**.
- Mix of true (5) and false (5) statements.
- Base them clearly on the text content.
- Use the character's name ({name_2}) in statements.
- **DO NOT make statements about what the character's name is.**



═══════════════════════════════════════════════════════════════
ACTIVITY 9: TENSE IDENTIFICATION (6 sentences)
═══════════════════════════════════════════════════════════════
**CREATE EXACTLY 6 SENTENCES** in {LANGUAGE_MAP.get(job['language'], job['language'])} using target vocabulary.
Mix of tenses: 2 each of Present, Past, Future.
Sentences should clearly demonstrate the tense used.
Keep sentences short (under 10 words each).

═══════════════════════════════════════════════════════════════
ACTIVITY 10: MATCH OPINIONS (3 pairs)
═══════════════════════════════════════════════════════════════
**CREATE EXACTLY 3 PAIRS** related to the reading texts.
- Idea: 3-5 word summary in English (e.g., "Benefits of outdoor activities")
- Opinion: A short opinion sentence in {LANGUAGE_MAP.get(job['language'], job['language'])}

Example ideas: "Environmental protection", "Future plans", "Health benefits"

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT (JSON)
═══════════════════════════════════════════════════════════════
{{
    "match_up": [ 
        {{ "target": "word in target language", "english": "English translation" }} 
    ],
    "gap_fill_sentences": [ 
        {{ "sentence": "Full sentence with the word", "target_word": "the specific word used" }} 
    ],
    "mistakes": [ 
        {{ "incorrect": "sentence with error", "correct": "corrected sentence" }} 
    ],
    "translation_pairs": [ 
        {{ "english": "English sentence", "target": "Target language sentence", "target_word": "key word" }} 
    ],
    "reading": {{
        "text": "The reading passage text",
        "questions": [ {{ "question": "Question in English", "answer": "Expected answer" }} ]
    }},
    "reading_tf": {{
        "text": "Different reading passage text",
        "items": [ {{ "statement": "Statement about text", "is_true": true }} ]
    }},
    "tense_id": [
        {{ "sentence": "Sentence in target language", "tense": "Present" }}
    ],
    "match_opinion": [
        {{ "idea": "Short idea summary", "opinion": "Opinion in target language" }}
    ]
}}
"""
        
        # 3. Call AI with retry logic
        logger.info("Generating content with AI...")
        data = None
        
        for attempt in range(self.max_retries):
            try:
                response = await client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                    max_tokens=4000
                )
                
                raw_content = response.choices[0].message.content
                data = json.loads(raw_content)
                
                # Validate required fields exist
                required_fields = ['match_up', 'gap_fill_sentences', 'mistakes', 
                                   'translation_pairs', 'reading', 'reading_tf', 
                                   'tense_id', 'match_opinion']
                missing_fields = [f for f in required_fields if f not in data]
                
                if missing_fields:
                    logger.warning(f"Missing fields: {missing_fields}. Retrying...")
                    if attempt < self.max_retries - 1:
                        continue
                
                # --- VERIFICATION LOOP ---
                # We send the data back to AI to check for specific errors
                verified_data = await self.verify_response(data, job)
                
                # Safety Check: If verification wiped out Reading or True/False, restore from original
                if not verified_data.get('reading_tf', {}).get('text'):
                    logger.warning("Verification wiped Activity 8 (True/False). Restoring original.")
                    verified_data['reading_tf'] = data.get('reading_tf')
                    
                if not verified_data.get('reading', {}).get('text'):
                     logger.warning("Verification wiped Activity 7 (Reading). Restoring original.")
                     verified_data['reading'] = data.get('reading')
                
                data = verified_data
                
                # --- SPECIFIC GAP FILL REPAIR ---
                # Force check for exact word matching AND valid word bank
                data = await self.repair_gap_fill(data, job['gap_fill_word_list'])
                
                break  # Success
                
            except Exception as e:
                logger.error(f"AI Error: {e}")
                if attempt < self.max_retries - 1:
                    await asyncio.sleep(self.retry_delay)
                    continue
                raise
        
        if not data:
            raise ValueError("Failed to generate valid content")
        
        # --- POST-PROCESSING ---
        
        # 1. Match Up: Shuffle English side
        match_english = [m['english'] for m in data['match_up']]
        random.shuffle(match_english)
        
        # Shuffle Activity 8 (True/False) items
        if 'reading_tf' in data and 'items' in data['reading_tf']:
            random.shuffle(data['reading_tf']['items'])
            
        # Process Match Opinion (Activity 10) - Shuffle Answers
        if 'match_opinion' in data:
            mo_pairs = data['match_opinion']
            # Right side (Opinions) - Shuffled
            mo_opinions = [{'text': p['opinion'], 'letter': chr(65+i)} for i, p in enumerate(mo_pairs)]
            random.shuffle(mo_opinions)
            # Re-assign letters after shuffle so they are A, B, C in order of display? 
            # No, we want the display to be A, B, C.
            for i, item in enumerate(mo_opinions):
                item['letter'] = chr(65 + i)
            
            # Left side (Ideas) - Ordered
            mo_ideas = []
            for i, pair in enumerate(mo_pairs):
                # Find the letter for this pair's opinion
                correct_op = next(op for op in mo_opinions if op['text'] == pair['opinion'])
                mo_ideas.append({
                    'id': i + 1,
                    'idea': pair['idea'],
                    'answer_letter': correct_op['letter']
                })
            
            data['match_opinion_render'] = {
                'ideas': mo_ideas,
                'opinions': mo_opinions
            }
        
        # Re-structure match_up for the template
        # We need: 
        # Left: [ {id: 1, text: 'Hola', answer_letter: 'C'} ]
        # Right: [ {letter: 'A', text: 'Goodbye'}, {letter: 'B', text: '...'} ]
        
        original_pairs = data['match_up'] # [{'target': '...', 'english': '...'}]
        
        # Create Right Side (English) - Shuffled
        right_side = [{'text': p['english'], 'original_target': p['target']} for p in original_pairs]
        random.shuffle(right_side)
        for i, item in enumerate(right_side):
            item['letter'] = chr(65 + i) # A, B, C...
            
        # Create Left Side (Target) - Ordered
        left_side = []
        for i, pair in enumerate(original_pairs):
            # Find the letter for this pair's english translation
            correct_right = next(r for r in right_side if r['text'] == pair['english'])
            left_side.append({
                'id': i + 1,
                'text': pair['target'],
                'answer_letter': correct_right['letter']
            })
            
        data['match_up_render'] = {
            'left': left_side,
            'right': right_side
        }

        # 2. Choose Correct: Assign Python-generated data
        data['choose_correct'] = choose_correct_data

        # 3. Unjumble: Generate in Python with READABLE scrambling
        # Key: Don't make it TOO scrambled - students need to recognize letter patterns
        unjumble_data = []
        for w in unjumble_words:
            word = w['word']
            
            # Create a readable scramble - swap adjacent pairs rather than full shuffle
            # This keeps the word somewhat recognizable
            chars = list(word)
            scrambled = word
            
            if len(chars) >= 4:
                # Swap pairs method - more readable
                # e.g., "cantar" -> "acntра" (swap positions 0-1, 2-3, etc.)
                for i in range(0, len(chars) - 1, 2):
                    chars[i], chars[i + 1] = chars[i + 1], chars[i]
                scrambled = "".join(chars)
                
                # If still same as original, also reverse
                if scrambled == word:
                    scrambled = word[::-1]
            elif len(chars) >= 2:
                # For short words, just reverse
                scrambled = word[::-1]
            
            # No spacing - just uppercase scrambled letters
            scrambled_upper = scrambled.upper()
            
            unjumble_data.append({
                'scrambled': scrambled_upper,
                'solution': word
            })
        data['unjumble'] = unjumble_data

        # 4. Gap Fill: Process Sentences
        gap_fill_render = {
            'words': sorted(gap_fill_word_list), # Alphabetical word bank
            'sentences': []
        }
        
        # Shuffle the sentences so they don't match the word bank order
        ai_sentences = data.get('gap_fill_sentences', [])
        random.shuffle(ai_sentences)
        
        for item in ai_sentences:
            sentence = item['sentence']
            target = item['target_word']
            
            # 1. Find the matching word in our official word bank
            matched_bank_word = None
            
            # STRICT Exact match only - because we now enforce it in repair_gap_fill
            if target in gap_fill_render['words']:
                matched_bank_word = target
            else:
                # Fallback: Check if target is in words list (case insensitive)
                for w in gap_fill_render['words']:
                    if target.lower() == w.lower():
                        matched_bank_word = w
                        break
            
            if not matched_bank_word:
                # If we can't find the exact word, it means repair failed or something else is wrong.
                # We skip this sentence to avoid broken output.
                logger.warning(f"Skipping Gap Fill sentence: Target '{target}' not found in word bank.")
                continue 
            
            # 2. Find where to split the sentence
            # We must split by the EXACT matched word to ensure we don't match substrings like "el" in "el puesto"
            
            # Use regex with word boundaries if possible, but 'el puesto' has space.
            # So we just search for the exact string.
            
            parts = re.split(f"({re.escape(matched_bank_word)})", sentence, flags=re.IGNORECASE)
            
            if len(parts) < 3:
                # If exact match failed (maybe case difference?), try case-insensitive
                # This should have been caught by re.IGNORECASE above, but just in case
                pass

            if len(parts) >= 3:
                part1 = parts[0]
                # We ignore the middle part (what was matched) because it becomes the gap
                part2 = "".join(parts[2:])
            else:
                # Fallback: just append sentence and empty part2
                part1 = sentence
                part2 = ""
                    
            gap_fill_render['sentences'].append({
                'part1': part1,
                'answer': matched_bank_word, # The official word from the bank
                'answer_letter': chr(97 + gap_fill_render['words'].index(matched_bank_word)) if matched_bank_word in gap_fill_render['words'] else '?',
                'part2': part2
            })
            
        data['gap_fill'] = gap_fill_render

        # 5. Translation Pairs: Process and prepare for rendering
        translation_gaps_render = []
        ai_trans_pairs = data.get('translation_pairs', [])
        
        for item in ai_trans_pairs:
            english = item.get('english', '')
            target_sentence = item.get('target', '')
            target_word = item.get('target_word', '')
            
            # Split target sentence by target word
            if target_word and target_word.lower() in target_sentence.lower():
                parts = re.split(f"({re.escape(target_word)})", target_sentence, flags=re.IGNORECASE)
                if len(parts) >= 3:
                    translation_gaps_render.append({
                        "english": english,
                        "target_start": parts[0],
                        "missing_word": target_word, # Use the word from the sentence to preserve case? No, use target_word for answer key
                        "target_end": "".join(parts[2:])
                    })
                else:
                     translation_gaps_render.append({
                         "english": english,
                         "target_start": target_sentence,
                         "missing_word": target_word,
                         "target_end": ""
                     })
            else:
                 # Fallback
                 translation_gaps_render.append({
                     "english": english,
                     "target_start": target_sentence,
                     "missing_word": target_word,
                     "target_end": ""
                 })
        
        data['translation_gaps'] = translation_gaps_render

        # 10. Match Opinion: Shuffle Opinions with fallback
        if 'match_opinion' in data and data['match_opinion']:
            opinions_list = []
            for i, item in enumerate(data['match_opinion']):
                opinions_list.append({
                    'id': i + 1, # 1, 2, 3
                    'idea': item.get('idea', f'Idea {i+1}'),
                    'opinion': item.get('opinion', '')
                })
            
            # Create shuffled opinions with letters
            shuffled_opinions = [{'text': item['opinion'], 'original_id': item['id']} for item in opinions_list]
            random.shuffle(shuffled_opinions)
            for i, item in enumerate(shuffled_opinions):
                item['letter'] = chr(65 + i) # A, B, C
            
            # Map answers back to ideas
            render_opinions = []
            for item in opinions_list:
                # Find the letter for this idea's opinion
                correct_op = next((o for o in shuffled_opinions if o['text'] == item['opinion']), None)
                if correct_op:
                    render_opinions.append({
                        'id': item['id'],
                        'idea': item['idea'],
                        'answer_letter': correct_op['letter']
                    })
                
            data['match_opinion_render'] = {
                'ideas': render_opinions,
                'opinions': shuffled_opinions
            }
        else:
            # Provide empty default
            data['match_opinion_render'] = {'ideas': [], 'opinions': []}
        
        # Ensure all required data structures have defaults for the template
        if 'mistakes' not in data or not data['mistakes']:
            data['mistakes'] = []
        if 'reading' not in data or not data['reading']:
            data['reading'] = {'text': '', 'questions': []}
        if 'reading_tf' not in data or not data['reading_tf']:
            data['reading_tf'] = {'text': '', 'items': []}
        if 'tense_id' not in data or not data['tense_id']:
            data['tense_id'] = []


        # Add Meta Data
        data['meta'] = {
            "topic": f"{job['theme']} - {job['unit']}",
            "language": LANGUAGE_MAP.get(job['language'], job['language']),
            "exam_board": job.get('exam_board', 'GCSE'),
            "tier": job.get('tier', 'All'),
            "batch_info": f"Worksheet {batch_num} of {total_batches}"
        }
        
        # 4. Render PDF and return success
        final_path = await self.render_pdf(data, job, batch_num)
        return final_path
        
    async def render_pdf(self, data: Dict[str, Any], job: Dict[str, Any], batch_num: int) -> str:
        """Render the worksheet data to PDF using Playwright."""
        logger.info("Rendering PDF...")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            
            # Load Template
            script_dir = os.path.dirname(os.path.abspath(__file__))
            template_path = os.path.join(script_dir, "gcse_new_template.html")
            
            if not os.path.exists(template_path):
                raise FileNotFoundError(f"Template not found: {template_path}")
            
            await page.goto(f"file://{template_path}")
            
            # Inject Data - escape for JavaScript
            json_data = json.dumps(data)
            await page.evaluate(f"renderData({json_data}, false)")
            await page.wait_for_timeout(1000)
            
            # Save Student Version
            os.makedirs(OUTPUT_DIR, exist_ok=True)
            
            # Create safe filename
            safe_topic = f"{job['theme']}_{job['unit']}"
            # Remove unsafe characters
            for char in [' ', '/', '\\', ':', '*', '?', '"', '<', '>', '|']:
                safe_topic = safe_topic.replace(char, '_')
            safe_name = f"{job['language']}_{safe_topic}_Vol{batch_num}"
            
            student_pdf = f"{OUTPUT_DIR}/{safe_name}_student.pdf"
            await page.pdf(path=student_pdf, format="A4", print_background=True)
            
            # Inject Answers
            await page.evaluate(f"renderData({json_data}, true)")
            await page.wait_for_timeout(500)
            answers_pdf = f"{OUTPUT_DIR}/{safe_name}_answers.pdf"
            await page.pdf(path=answers_pdf, format="A4", print_background=True)
            
            await browser.close()
            
            # Combine PDFs
            from pypdf import PdfReader, PdfWriter
            writer = PdfWriter()
            
            for pdf in [student_pdf, answers_pdf]:
                reader = PdfReader(pdf)
                for page_obj in reader.pages:
                    writer.add_page(page_obj)
            
            final_path = f"{OUTPUT_DIR}/{safe_name}_MASTER.pdf"
            with open(final_path, "wb") as f:
                writer.write(f)
                
            # Cleanup temporary files
            os.remove(student_pdf)
            os.remove(answers_pdf)
            
            logger.info(f"Created: {final_path}")
            return final_path

def fetch_vocab_paginated(language, exam_board):
    print(f"📡 Fetching vocabulary for {language.upper()} ({exam_board})...")
    all_rows = []
    page_size = 1000
    offset = 0
    
    while True:
        response = supabase.table("centralized_vocabulary")\
            .select("language, word, translation, part_of_speech, theme_name, unit_name, exam_board_code, tier")\
            .eq("curriculum_level", "KS4")\
            .eq("language", language)\
            .eq("exam_board_code", exam_board)\
            .range(offset, offset + page_size - 1)\
            .execute()
            
        rows = response.data
        if not rows:
            break
            
        all_rows.extend(rows)
        print(f"   Fetched {len(rows)} rows (Total: {len(all_rows)})...")
        
        if len(rows) < page_size:
            break
        offset += page_size
        
    return all_rows

def main():
    print("\n🎓 GCSE Mastery Worksheet Generator\n")
    
    # 1. Select Language
    languages = [
        questionary.Choice("French", value="fr"),
        questionary.Choice("German", value="de"),
        questionary.Choice("Spanish", value="es")
    ]
    language = questionary.select("Select Language:", choices=languages).ask()
    if not language: return

    # 2. Select Exam Board
    boards = ["AQA", "Edexcel"]
    exam_board = questionary.select("Select Exam Board:", choices=boards).ask()
    if not exam_board: return

    # 3. Select Tier
    tiers = [
        questionary.Choice("Foundation", value="foundation"),
        questionary.Choice("Higher", value="higher")
    ]
    tier = questionary.select("Select Tier:", choices=tiers).ask()
    if not tier: return

    # 4. Fetch Data
    vocab_list = fetch_vocab_paginated(language, exam_board)
    
    if not vocab_list:
        print("❌ No vocabulary found for this combination.")
        return

    # 5. Filter by Tier & Group by Unit (Aggregating all words for the unit)
    unit_to_words = defaultdict(list)
    unit_to_themes = defaultdict(lambda: defaultdict(int))
    
    # Tier Logic: 
    # Foundation -> 'foundation' + 'both'
    # Higher -> 'higher' + 'both'
    allowed_tiers = ['both', tier]
    
    for row in vocab_list:
        row_tier = row.get('tier', 'both')
        if row_tier and row_tier.lower() not in allowed_tiers:
            continue
            
        # Handle Theme/Unit splitting
        themes = (row.get('theme_name') or 'Uncategorized').split(';')
        units = (row.get('unit_name') or 'General').split(';')
        
        # Clean whitespace
        themes = [t.strip() for t in themes if t.strip()]
        units = [u.strip() for u in units if u.strip()]
        
        for u in units:
            # Add word to the unit group
            # Check if word is already in the list to avoid duplicates (since we iterate rows)
            # But we are building fresh lists here.
            # However, if a word has "Unit A; Unit B", it goes to both.
            # If a word has "Unit A" and "Theme X; Theme Y", it goes to Unit A once.
            
            # We need to store the word object.
            # Since we iterate rows, and a row represents a word, we just append.
            unit_to_words[u].append(row)
            
            # Count theme occurrences for this unit to find the Primary Theme
            for t in themes:
                unit_to_themes[u][t] += 1
        
    jobs = []
    for unit, words in unit_to_words.items():
        # Remove duplicates based on word ID or text (just in case)
        unique_vocab = {v['word']: v for v in words}.values()
        vocab = list(unique_vocab)
        
        if len(vocab) >= 10:
            # Find Primary Theme
            theme_counts = unit_to_themes[unit]
            if theme_counts:
                primary_theme = max(theme_counts, key=theme_counts.get)
            else:
                primary_theme = 'Uncategorized'
                
            jobs.append({
                "language": language,
                "exam_board": exam_board,
                "tier": tier,
                "theme": primary_theme,
                "unit": unit,
                "vocab": vocab,
                "display": f"{primary_theme} - {unit} ({len(vocab)} words)"
            })
            
    jobs.sort(key=lambda x: x['display'])
    
    if not jobs:
        print("❌ No valid topics found.")
        return

    print("\nAvailable Topics:")
    for j in jobs:
        print(f"  - {j['display']}")

    # 6. Select Topic
    choices = [j['display'] for j in jobs]
    selection = questionary.select("Select a Topic:", choices=choices).ask()
    
    if not selection: return
    
    selected_job = next(j for j in jobs if j['display'] == selection)
    
    # 7. BATCHING LOGIC
    full_vocab = selected_job['vocab']
    # Sort alphabetically by target word to ensure consistent batches
    full_vocab.sort(key=lambda x: x['word'].lower())
    
    # Use the constant defined at module level
    batches = [full_vocab[i:i + BATCH_SIZE] for i in range(0, len(full_vocab), BATCH_SIZE)]
    
    # Handle last batch if it's too small (less than 10 words)
    if len(batches) > 1 and len(batches[-1]) < MIN_WORDS_FOR_WORKSHEET:
        # Merge last batch with second-to-last
        batches[-2].extend(batches[-1])
        batches.pop()
    
    print(f"\n📚 Found {len(full_vocab)} words. Creating {len(batches)} worksheets (Vol 1-{len(batches)}).")
    
    generator = GCSEWorksheetGenerator()
    
    # Track success/failure
    successful = 0
    failed = 0
    
    for i, batch in enumerate(batches):
        try:
            # Create a sub-job for this batch
            batch_job = selected_job.copy()
            batch_job['vocab'] = batch
            result = asyncio.run(generator.generate(batch_job, i + 1, len(batches)))
            if result is not None:
                successful += 1
            else:
                failed += 1
        except Exception as e:
            logger.error(f"Failed to generate batch {i+1}: {e}")
            failed += 1
    
    # Summary
    print(f"\n{'='*50}")
    print(f"📊 Generation Complete!")
    print(f"   ✅ Successful: {successful}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Output: {OUTPUT_DIR}/")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    main()
