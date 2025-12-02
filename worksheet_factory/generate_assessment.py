import os
import json
import asyncio
import base64
from playwright.async_api import async_playwright
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Supabase Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    # Fallback to hardcoded project ID if env vars are missing (for this specific user session context)
    # But ideally we use env vars. The user has .env.local in the root.
    # Let's try to load from parent directory if not found
    if not SUPABASE_URL:
        load_dotenv('../.env.local')
        SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials not found. Please ensure .env.local exists.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

OUTPUT_DIR = "output/assessments"

def get_logo_base64():
    logo_path = "logo.png"
    if not os.path.exists(logo_path):
        return ""
    with open(logo_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        return f"data:image/png;base64,{encoded_string}"

async def generate_assessment_pdf(task_id):
    print(f"🚀 Generating PDF for Task ID: {task_id}")

    # 1. Fetch Data
    try:
        task_response = supabase.table("reading_comprehension_tasks").select("*").eq("id", task_id).single().execute()
        task = task_response.data
        
        questions_response = supabase.table("reading_comprehension_questions").select("*").eq("task_id", task_id).execute()
        questions = questions_response.data
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return

    if not task:
        print("❌ Task not found.")
        return

    print(f"   Title: {task['title']}")
    print(f"   Questions: {len(questions)}")

    # 2. Prepare Data for Template
    data = {
        "title": task['title'],
        "content": task['content'],
        "questions": questions,
        "logo_base64": get_logo_base64()
    }

    # 3. Render PDF
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Load Template
        script_dir = os.path.dirname(os.path.abspath(__file__))
        template_path = os.path.join(script_dir, "assessment_template.html")
        await page.goto(f"file://{template_path}")

        # Inject Data (Student Version)
        await page.evaluate(f"renderData({json.dumps(data)}, false)")
        await page.wait_for_timeout(500)

        os.makedirs(OUTPUT_DIR, exist_ok=True)
        safe_title = task['title'].replace(" ", "_").replace("/", "-")
        student_pdf = f"{OUTPUT_DIR}/{safe_title}_Student.pdf"
        
        await page.pdf(path=student_pdf, format="A4", print_background=True)
        print(f"   ✅ Saved Student PDF: {student_pdf}")

        # Inject Data (Answer Key)
        await page.evaluate(f"renderData({json.dumps(data)}, true)")
        await page.wait_for_timeout(500)
        
        answers_pdf = f"{OUTPUT_DIR}/{safe_title}_Answers.pdf"
        await page.pdf(path=answers_pdf, format="A4", print_background=True)
        print(f"   ✅ Saved Answer Key: {answers_pdf}")

        # Merge PDFs (Optional, but requested "one file" usually implies merged or zip)
        # The user said "a PDF", singular. So let's merge them.
        from pypdf import PdfReader, PdfWriter
        
        writer = PdfWriter()
        
        # Add student page(s)
        student_reader = PdfReader(student_pdf)
        for p_obj in student_reader.pages:
            writer.add_page(p_obj)
            
        # Add answer page(s)
        answers_reader = PdfReader(answers_pdf)
        for p_obj in answers_reader.pages:
            writer.add_page(p_obj)
            
        final_pdf = f"{OUTPUT_DIR}/{safe_title}.pdf"
        with open(final_pdf, "wb") as f:
            writer.write(f)
            
        print(f"   🎉 Final Merged PDF: {final_pdf}")
        
        # Cleanup temp files
        os.remove(student_pdf)
        os.remove(answers_pdf)

        await browser.close()

if __name__ == "__main__":
    # You can change this ID to generate different assessments
    TASK_ID = "c17f7506-f0d6-488c-b5bc-5f8586fc7049"
    asyncio.run(generate_assessment_pdf(TASK_ID))
