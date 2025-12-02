import os
import json
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import AsyncOpenAI

# Load environment variables
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY") or os.getenv("NEXT_PUBLIC_OPENAI_API_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials missing.")

# Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

async def fix_description(product):
    print(f"Checking: {product['name']}")
    
    current_desc = product['description'] or ""
    current_summary = product['short_summary'] or ""
    
    # Prompt to detect and fix
    prompt = f"""
    Analyze the following product description and summary for a language learning resource.
    
    Title: {product['name']}
    Current Description: "{current_desc}"
    Current Summary: "{current_summary}"
    
    Task:
    1. Determine if the Description is written primarily in English.
    2. If it is NOT in English (e.g. it is in Spanish, French, or German), rewrite it completely in English.
    3. If it IS in English, return "SKIP".
    
    The new description should be professional, marketing-oriented, and mention that it is a reading comprehension worksheet with questions and answers.
    
    Output JSON:
    {{
        "action": "FIX" or "SKIP",
        "description": "New English description...",
        "short_summary": "New English summary..."
    }}
    """
    
    try:
        response = await openai_client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        
        if result['action'] == "FIX":
            print(f"   ⚠️  Non-English detected. Fixing...")
            
            # Update DB
            supabase.table("products").update({
                "description": result['description'],
                "short_summary": result['short_summary']
            }).eq("id", product['id']).execute()
            
            print(f"   ✅ Updated.")
        else:
            print(f"   OK (English)")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")

async def main():
    # Fetch all products tagged with 'reading comprehension'
    # We can't easily filter by array containment in simple select sometimes, 
    # but we can fetch all worksheets or iterate.
    # Let's fetch all products created recently (e.g. today) or just all worksheets.
    
    print("Fetching products...")
    response = supabase.table("products").select("*").eq("resource_type", "Worksheet").execute()
    products = response.data
    
    print(f"Found {len(products)} products. Scanning for language issues...")
    
    # Process in chunks to avoid rate limits
    chunk_size = 5
    for i in range(0, len(products), chunk_size):
        chunk = products[i:i+chunk_size]
        await asyncio.gather(*(fix_description(p) for p in chunk))

if __name__ == "__main__":
    asyncio.run(main())
