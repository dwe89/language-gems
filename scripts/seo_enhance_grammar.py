#!/usr/bin/env python3
"""
SEO Enhancement Script for Grammar Pages
=========================================
This script uses OpenAI GPT-4.1-nano to generate SEO-optimized content for all grammar pages.

What it does:
1. Fetches all grammar pages from Supabase
2. For each page, generates:
   - SEO-optimized title (60 chars, keyword-rich)
   - SEO meta description (155 chars)
   - Target keywords
   - FAQ items (for schema markup)
   - Quick answer (for featured snippets)
3. Updates the database with the new SEO content

Usage:
    python scripts/seo_enhance_grammar.py

Environment variables required:
    NEXT_PUBLIC_SUPABASE_URL
    SUPABASE_SERVICE_ROLE_KEY
    OPENAI_API_KEY
"""

import os
import json
import time
from typing import List, Dict, Any
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# Load environment variables
load_dotenv('.env.local')

# Initialize clients
supabase: Client = create_client(
    os.environ['NEXT_PUBLIC_SUPABASE_URL'],
    os.environ['SUPABASE_SERVICE_ROLE_KEY']
)

openai_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

# Language display names
LANGUAGE_NAMES = {
    'spanish': 'Spanish',
    'french': 'French', 
    'german': 'German'
}

def generate_seo_content(page: Dict[str, Any]) -> Dict[str, Any]:
    """Generate SEO-optimized content for a grammar page using GPT-4.1-nano."""
    
    language_name = LANGUAGE_NAMES.get(page['language'], page['language'].title())
    
    # Extract first section content for context
    sections = page.get('sections', [])
    first_section_content = ''
    if sections and len(sections) > 0:
        first_section_content = sections[0].get('content', '')[:500]
    
    prompt = f"""You are an SEO expert for a language learning website. Generate SEO content for this grammar page.

PAGE INFO:
- Language: {language_name}
- Category: {page['category'].replace('-', ' ').title()}
- Topic: {page['topic_slug'].replace('-', ' ').title()}
- Current Title: {page['title']}
- Current Description: {page['description']}
- Content Preview: {first_section_content}

Generate the following in JSON format:

1. seo_title: An SEO-optimized title (50-60 characters). Include the language name and main keyword. Format: "[Language] [Topic]: [Benefit/Hook]"
   Examples: "Spanish Indirect Object Pronouns: Complete Guide with Examples"
   
2. seo_description: A compelling meta description (150-155 characters) that includes keywords and a call-to-action.
   
3. seo_keywords: Array of 5-8 target keywords/phrases people actually search for. Include variations.
   
4. quick_answer: A 1-2 sentence direct answer to "What is [topic]?" for featured snippets.
   
5. faq_items: Array of 3 FAQ objects with "question" and "answer" keys. Questions people commonly ask about this topic.

Respond ONLY with valid JSON, no markdown:
{{"seo_title": "...", "seo_description": "...", "seo_keywords": [...], "quick_answer": "...", "faq_items": [{{"question": "...", "answer": "..."}}]}}"""

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "You are an SEO expert. Respond only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Parse JSON response
        seo_data = json.loads(content)
        return seo_data
        
    except json.JSONDecodeError as e:
        print(f"  ⚠️ JSON parse error: {e}")
        print(f"  Response was: {content[:200]}...")
        return None
    except Exception as e:
        print(f"  ❌ API error: {e}")
        return None


def update_page_seo(page_id: str, seo_data: Dict[str, Any]) -> bool:
    """Update a grammar page with SEO content."""
    try:
        result = supabase.table('grammar_pages').update({
            'seo_title': seo_data.get('seo_title'),
            'seo_description': seo_data.get('seo_description'),
            'seo_keywords': seo_data.get('seo_keywords', []),
            'quick_answer': seo_data.get('quick_answer'),
            'faq_items': seo_data.get('faq_items', []),
            'updated_at': 'now()'
        }).eq('id', page_id).execute()
        
        return True
    except Exception as e:
        print(f"  ❌ Database update error: {e}")
        return False


def main():
    """Main function to process all grammar pages."""
    print("🚀 SEO Enhancement Script for Grammar Pages")
    print("=" * 50)
    
    # Fetch all pages that need SEO enhancement
    print("\n📥 Fetching grammar pages from database...")
    
    result = supabase.table('grammar_pages').select(
        'id, language, category, topic_slug, title, description, sections, seo_title'
    ).is_('seo_title', 'null').order('language').execute()
    
    pages = result.data
    print(f"   Found {len(pages)} pages without SEO content")
    
    if not pages:
        print("\n✅ All pages already have SEO content!")
        return
    
    # Process each page
    success_count = 0
    error_count = 0
    
    for i, page in enumerate(pages, 1):
        print(f"\n[{i}/{len(pages)}] Processing: {page['language']}/{page['category']}/{page['topic_slug']}")
        
        # Generate SEO content
        seo_data = generate_seo_content(page)
        
        if seo_data:
            print(f"   ✅ Generated: {seo_data.get('seo_title', 'N/A')[:50]}...")
            
            # Update database
            if update_page_seo(page['id'], seo_data):
                success_count += 1
                print(f"   ✅ Saved to database")
            else:
                error_count += 1
        else:
            error_count += 1
        
        # Rate limiting - be nice to the API
        if i < len(pages):
            time.sleep(0.5)  # 500ms between requests
    
    # Summary
    print("\n" + "=" * 50)
    print(f"🎉 SEO Enhancement Complete!")
    print(f"   ✅ Success: {success_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📊 Total processed: {len(pages)}")


if __name__ == "__main__":
    main()
