import os
import json
import asyncio
import base64
import re
import requests
from datetime import datetime
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import AsyncOpenAI
from pypdf import PdfReader, PdfWriter

# Load environment variables
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NEXT_PUBLIC_OPENAI_API_KEY")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials missing.")

if not OPENAI_API_KEY:
    print("⚠️ OpenAI API Key missing. Description generation will be skipped/mocked.")

# Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

OUTPUT_DIR = "output/published"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_logo_base64():
    logo_path = "worksheet_factory/logo.png"
    if not os.path.exists(logo_path):
        # Try current dir
        logo_path = "logo.png"
    
    if not os.path.exists(logo_path):
        return ""
        
    with open(logo_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def create_stripe_product(name, description, price_cents):
    if not STRIPE_SECRET_KEY:
        print("⚠️ Stripe Secret Key missing. Skipping Stripe creation.")
        return None

    headers = {
        "Authorization": f"Bearer {STRIPE_SECRET_KEY}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    # 1. Create Product
    product_data = {
        "name": name,
        "description": description[:500] if description else "", # Limit length
    }
    
    try:
        resp = requests.post("https://api.stripe.com/v1/products", headers=headers, data=product_data)
        resp.raise_for_status()
        stripe_prod = resp.json()
        stripe_prod_id = stripe_prod['id']
        print(f"   💳 Created Stripe Product: {stripe_prod_id}")
    except Exception as e:
        print(f"   ❌ Stripe Product Creation Failed: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"      Response: {e.response.text}")
        return None

    # 2. Create Price
    price_data = {
        "product": stripe_prod_id,
        "unit_amount": price_cents,
        "currency": "gbp",
    }
    
    try:
        resp = requests.post("https://api.stripe.com/v1/prices", headers=headers, data=price_data)
        resp.raise_for_status()
        stripe_price = resp.json()
        print(f"   💷 Created Stripe Price: {stripe_price['id']}")
        return stripe_price['id']
    except Exception as e:
        print(f"   ❌ Stripe Price Creation Failed: {e}")
        return None

async def generate_description(task):
    if not openai_client:
        return f"A reading comprehension worksheet on {task['title']}.", "Reading comprehension worksheet."

    prompt = f"""
    Write a product description IN ENGLISH for a {task['language']} reading comprehension worksheet titled "{task['title']}".
    
    Context:
    - Level: {task['curriculum_level']}
    - Category: {task['category']}
    - Subcategory: {task['subcategory']}
    - Content snippet: "{task['content'][:200]}..."
    
    The product includes a text, comprehension questions, and an answer key.
    
    IMPORTANT: The description MUST be written in English, even though the resource content is in {task['language']}.
    
    Output JSON format:
    {{
        "description": "Full markdown description in English...",
        "short_summary": "One sentence summary in English..."
    }}
    """
    
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        content = json.loads(response.choices[0].message.content)
        return content['description'], content['short_summary']
    except Exception as e:
        print(f"⚠️ OpenAI Error: {e}")
        return f"Reading comprehension on {task['title']}.", f"Worksheet on {task['title']}."

async def upload_file(file_path, bucket, folder):
    file_name = os.path.basename(file_path)
    # Add timestamp to avoid collisions
    timestamp = int(datetime.now().timestamp())
    storage_path = f"{folder}/{timestamp}_{file_name}"
    
    print(f"   ⬆️ Uploading {file_name} to {bucket}/{storage_path}...")
    
    with open(file_path, 'rb') as f:
        try:
            response = supabase.storage.from_(bucket).upload(
                path=storage_path,
                file=f,
                file_options={"cache-control": "3600", "upsert": "false"}
            )
            # Get Public URL
            public_url = supabase.storage.from_(bucket).get_public_url(storage_path)
            return public_url
        except Exception as e:
            print(f"   ❌ Upload failed: {e}")
            # If it failed because it exists (unlikely with timestamp), try to get url anyway
            return supabase.storage.from_(bucket).get_public_url(storage_path)

async def publish_assessment(task_id):
    print(f"🚀 Publishing Assessment for Task ID: {task_id}")

    # 1. Fetch Data
    task_response = supabase.table("reading_comprehension_tasks").select("*").eq("id", task_id).single().execute()
    task = task_response.data
    
    questions_response = supabase.table("reading_comprehension_questions").select("*").eq("task_id", task_id).execute()
    questions = questions_response.data

    if not task:
        print("❌ Task not found.")
        return

    print(f"   Title: {task['title']}")

    # 2. Prepare Data for Template
    data = {
        "title": task['title'],
        "content": task['content'],
        "questions": questions,
        "logo_base64": get_logo_base64()
    }

    # 3. Generate PDF & Thumbnail
    safe_title = slugify(task['title'])
    student_pdf = f"{OUTPUT_DIR}/{safe_title}_Student.pdf"
    answers_pdf = f"{OUTPUT_DIR}/{safe_title}_Answers.pdf"
    final_pdf = f"{OUTPUT_DIR}/{safe_title}.pdf"
    thumbnail_png = f"{OUTPUT_DIR}/{safe_title}_thumb.png"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load Template
        script_dir = os.path.dirname(os.path.abspath(__file__))
        template_path = os.path.join(script_dir, "assessment_template.html")
        await page.goto(f"file://{template_path}")

        # Render Student Version
        await page.evaluate(f"renderData({json.dumps(data)}, false)")
        await page.wait_for_timeout(500) # Wait for render

        # Take Screenshot for Preview
        preview_png = f"{OUTPUT_DIR}/{safe_title}_preview.png"
        await page.set_viewport_size({"width": 800, "height": 800})
        await page.screenshot(path=preview_png)
        print(f"   📸 Generated Preview: {preview_png}")
        
        # Reset viewport for PDF
        await page.set_viewport_size({"width": 1280, "height": 1024})

        # Save Student PDF
        await page.pdf(path=student_pdf, format="A4", print_background=True)
        
        # Render Answer Key
        await page.evaluate(f"renderData({json.dumps(data)}, true)")
        await page.wait_for_timeout(500)
        await page.pdf(path=answers_pdf, format="A4", print_background=True)

        await browser.close()

    # 4. Merge PDFs
    writer = PdfWriter()
    for pdf in [student_pdf, answers_pdf]:
        reader = PdfReader(pdf)
        for p_obj in reader.pages:
            writer.add_page(p_obj)
    
    with open(final_pdf, "wb") as f:
        writer.write(f)
    print(f"   ✅ Generated Final PDF: {final_pdf}")

    # 5. Generate Description
    print("   🤖 Generating Description...")
    description, short_summary = await generate_description(task)

    # 6. Upload Files
    print("   ☁️  Uploading Files...")
    pdf_url = await upload_file(final_pdf, "products", "files")
    preview_url = await upload_file(preview_png, "products", "thumbnails") # Keep in thumbnails bucket for simplicity or move to previews
    
    # Upload STATIC thumbnail (or use existing URL if known to save uploads)
    # We use the local file 'worksheet_factory/thumbnail.png'
    static_thumb_path = "worksheet_factory/thumbnail.png"
    if os.path.exists(static_thumb_path):
        # We can re-upload or just use the known static URL if we want to be efficient.
        # But uploading ensures it works. Let's upload to a unique path per product? 
        # No, user said "ALL ... have THIS". It implies the same image.
        # But for the DB, we need a URL. 
        # Let's upload it once or use a fixed path.
        # Actually, let's just upload it to a unique path to be safe with Supabase caching/overwriting issues if we used one file.
        # But wait, 600 copies of the same image is wasteful.
        # Let's use the one we uploaded in update_thumbnails.py if possible.
        # But we don't have that URL here easily.
        # Let's upload it to `products/thumbnails/static_thumb.png` and reuse that URL?
        # Or just upload it every time. It's small.
        thumb_url = await upload_file(static_thumb_path, "products", "thumbnails")
    else:
        print("   ⚠️ Static thumbnail not found, using placeholder")
        thumb_url = "" 
    
    # Preview images should be the SCREENSHOT
    preview_images = [preview_url]

    # 7. Create Stripe Product
    print("   💳 Creating Stripe Product...")
    price_cents = 200 # £2.00
    stripe_price_id = create_stripe_product(task['title'], short_summary, price_cents)

    # 8. Create Product in DB
    print("   💾 Saving to Database...")
    
    # Determine tags
    tags = [
        "reading comprehension"
    ]
    if task['category']:
        tags.append(task['category'])
    if task['subcategory']:
        tags.append(task['subcategory'])
        
    # Determine Category ID
    # Use the slug directly as it matches ModernCategorySelector IDs
    category_id = task['category'] if task['category'] else None
    
    product_data = {
        "name": task['title'],
        "slug": safe_title,
        "description": description,
        "short_summary": short_summary,
        "price_cents": price_cents,
        "stripe_price_id": stripe_price_id,
        "file_path": pdf_url,
        "thumbnail_url": thumb_url,
        "preview_images": preview_images,
        "language": task['language'].capitalize() if task['language'] else "French",
        "key_stage": task['curriculum_level'] if task['curriculum_level'] else "ks3",
        "exam_board": "Generic",
        "resource_type": "Reading Comprehension",
        "tags": tags,
        "category_id": category_id,
        "is_active": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    # Insert
    try:
        res = supabase.table("products").insert(product_data).execute()
        print(f"   🎉 Product Created Successfully! ID: {res.data[0]['id']}")
        print(f"   🔗 Link: https://www.secondarymfl.com/resources/{safe_title}")
    except Exception as e:
        print(f"   ❌ Database Insert Failed: {e}")

async def process_all_languages():
    languages = ['german']
    
    for lang in languages:
        print(f"\n🔎 Fetching all {lang.capitalize()} tasks...")
        
        response = supabase.table("reading_comprehension_tasks").select("*").eq("language", lang).execute()
        tasks = response.data
        
        print(f"   Found {len(tasks)} tasks.")
        
        for i, task in enumerate(tasks):
            print(f"\n[{lang.upper()} {i+1}/{len(tasks)}] Processing: {task['title']}")
            
            # Check if product already exists
            safe_title = slugify(task['title'])
            existing = supabase.table("products").select("id").eq("slug", safe_title).execute()
            
            if existing.data:
                print(f"   ⏭️  Skipping '{task['title']}' (Product already exists)")
                continue
                
            try:
                await publish_assessment(task['id'])
                # Sleep briefly to be nice to APIs
                await asyncio.sleep(1) 
            except Exception as e:
                print(f"   ❌ Failed to process {task['title']}: {e}")

if __name__ == "__main__":
    # Run for all languages
    asyncio.run(process_all_languages())
