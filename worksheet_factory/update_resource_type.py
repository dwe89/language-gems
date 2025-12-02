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

async def update_types():
    print("🔎 Fetching products with 'reading comprehension' tag...")
    
    # Fetch products that have 'reading comprehension' in tags
    res = supabase.table("products").select("id, name, tags, resource_type").contains("tags", ["reading comprehension"]).execute()
    products = res.data
    
    print(f"   Found {len(products)} products.")
    
    ids_to_update = [p['id'] for p in products]
    
    if ids_to_update:
        print(f"   🔄 Updating {len(ids_to_update)} products to resource_type='Reading Comprehension'...")
        
        # Update in batches
        batch_size = 100
        for i in range(0, len(ids_to_update), batch_size):
            batch = ids_to_update[i:i+batch_size]
            try:
                supabase.table("products").update({"resource_type": "Reading Comprehension"}).in_("id", batch).execute()
                print(f"      Updated batch {i+1}-{min(i+batch_size, len(ids_to_update))}")
            except Exception as e:
                print(f"      ❌ Error updating batch: {e}")
            
    print("🎉 Done.")

if __name__ == "__main__":
    asyncio.run(update_types())
