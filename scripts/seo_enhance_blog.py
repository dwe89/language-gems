
import os
import time
import json
import logging
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# Load environment variables
load_dotenv('.env.local')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)
logger = logging.getLogger(__name__)

# Initialize clients
supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
openai_key = os.getenv("OPENAI_API_KEY")

if not all([supabase_url, supabase_key, openai_key]):
    logger.error("❌ Missing environment variables. Please check .env.local")
    exit(1)

supabase: Client = create_client(supabase_url, supabase_key)
client = OpenAI(api_key=openai_key)

SYSTEM_PROMPT = """
You are an SEO expert for a language learning website blog. 
Your goal is to maximize click-through rates (CTR) and search rankings for blog posts about language learning, GCSE exams, and teaching strategies.

Generate SEO metadata based on the blog post title and excerpt.

Output ONLY valid JSON with these fields:
1. "seo_title": SEO-optimized title (50-60 chars). 
   - Must include main keywords.
   - Format: "[Compelling Title] | [Benefit]" or "[Title]: [Subtitle]"
   - Example: "GCSE Spanish Speaking Exam: Top Tips for Grade 9"
2. "seo_description": Meta description (150-155 chars).
   - Hook the reader immediately.
   - Include a Call to Action (e.g., "Read now", "Learn more").
   - Include keywords naturally.
3. "keywords": Array of 5-8 target keywords/phrases. 
   - Mix of short-tail and long-tail.
   - Example: ["GCSE Spanish", "Spanish speaking exam", "AQA Spanish", "language revision tips"]

JSON format example:
{
  "seo_title": "Stop Cramming: Spaced Repetition Guide for Languages",
  "seo_description": "Discover why spaced repetition beats cramming for language learning. Master vocabulary 3x faster with our scientific guide. Read the full strategy now!",
  "keywords": ["spaced repetition", "language learning tips", "vocabulary memory", "GCSE revision", "Anki alternatives"]
}
"""

def enhance_blog_post(post):
    """Generate SEO metadata for a single blog post using GPT-4-nano"""
    
    # Construct prompt
    user_content = f"""
    Generate SEO content for this blog post:
    
    Title: {post['title']}
    Excerpt: {post['excerpt']}
    Category: {post.get('category', 'Language Learning')}
    Tags: {', '.join(post.get('tags', []) or [])}
    
    Current SEO Title: {post.get('seo_title') or 'None'}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-nano", # Using effective small model
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"},
            temperature=0.7
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"   ❌ AI Generation failed: {str(e)}")
        return None

def main():
    print("\n🚀 SEO Enhancement Script for Blog Posts")
    print("==================================================\n")

    # 1. Fetch posts without SEO title or description
    print("📥 Fetching blog posts...")
    
    # We want to process ALL published posts to ensure they have good SEO
    # But specifically target ones with missing fields first
    response = supabase.table("blog_posts") \
        .select("*") \
        .order("created_at", desc=True) \
        .execute()
    
    posts = response.data
    
    # Filter for posts that need enhancement (missing fields or just generic ones)
    # For this run, let's just do ones where seo_title is null OR empty
    posts_to_process = [
        p for p in posts 
        if not p.get('seo_title') or not p.get('seo_description')
    ]
    
    print(f"   Found {len(posts_to_process)} posts needing SEO enhancement\n")

    success_count = 0
    error_count = 0

    for i, post in enumerate(posts_to_process, 1):
        print(f"[{i}/{len(posts_to_process)}] Processing: {post['title']}")
        
        # Artificial delay to avoid rate limits
        time.sleep(0.5)

        # Generate SEO data
        seo_data = enhance_blog_post(post)
        
        if seo_data:
            # Update database
            try:
                update_data = {
                    "seo_title": seo_data["seo_title"],
                    "seo_description": seo_data["seo_description"],
                    "keywords": seo_data["keywords"]
                }
                
                supabase.table("blog_posts") \
                    .update(update_data) \
                    .eq("id", post['id']) \
                    .execute()
                
                print(f"   ✅ Generated: {seo_data['seo_title']}")
                print("   ✅ Saved to database\n")
                success_count += 1
            except Exception as e:
                print(f"   ❌ Database update failed: {str(e)}\n")
                error_count += 1
        else:
            error_count += 1

    print("==================================================")
    print("🎉 Blog SEO Enhancement Complete!")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📊 Total processed: {len(posts_to_process)}")

if __name__ == "__main__":
    main()
