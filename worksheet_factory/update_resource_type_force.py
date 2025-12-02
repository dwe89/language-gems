import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')
url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise ValueError("Supabase credentials missing")

supabase = create_client(url, key)

async def update_types_force():
    print("🔎 Fetching products with 'reading comprehension' tag...")
    
    # Fetch products that have 'reading comprehension' in tags
    # We need to be careful. The tags column is an array of text.
    # We want to find any product where the tags array contains 'reading comprehension' (case insensitive ideally, but tags are usually lower).
    
    # Also, let's check if there are products with "Reading Comprehension" (title case) in tags just in case.
    
    res = supabase.table("products").select("id, name, tags, resource_type").execute()
    all_products = res.data
    
    print(f"   Scanned {len(all_products)} total products.")
    
    ids_to_update = []
    
    for p in all_products:
        tags = p.get('tags') or []
        lower_tags = [t.lower() for t in tags]
        
        is_reading_comp = 'reading comprehension' in lower_tags
        has_worksheet = 'worksheet' in lower_tags
        
        if is_reading_comp:
            updates = {}
            
            # 1. Ensure resource_type is Reading Comprehension
            if p.get('resource_type') != 'Reading Comprehension':
                updates['resource_type'] = 'Reading Comprehension'
                
            # 2. Remove 'worksheet' tag if present
            if has_worksheet:
                # Filter out 'worksheet' (case insensitive)
                new_tags = [t for t in tags if t.lower() != 'worksheet']
                updates['tags'] = new_tags
                
            if updates:
                print(f"   🔧 Updating {p['name']}...")
                try:
                    supabase.table("products").update(updates).eq("id", p['id']).execute()
                    ids_to_update.append(p['id'])
                except Exception as e:
                    print(f"      ❌ Error updating: {e}")

    print(f"🎉 Updated {len(ids_to_update)} products.")
            
    print("🎉 Done.")

if __name__ == "__main__":
    asyncio.run(update_types_force())
