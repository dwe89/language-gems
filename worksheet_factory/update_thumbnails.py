import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv('.env.local')

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials missing.")

# Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

THUMBNAIL_PATH = "worksheet_factory/thumbnail.png"
STORAGE_PATH = "static/reading_comprehension_thumb.png"

async def upload_static_thumbnail():
    print(f"⬆️ Uploading static thumbnail to {STORAGE_PATH}...")
    
    with open(THUMBNAIL_PATH, 'rb') as f:
        try:
            # We use 'upsert' to overwrite if exists
            supabase.storage.from_("products").upload(
                path=STORAGE_PATH,
                file=f,
                file_options={"cache-control": "3600", "upsert": "true"}
            )
        except Exception as e:
            print(f"   ⚠️ Upload notice (might exist): {e}")

    # Get Public URL
    public_url = supabase.storage.from_("products").get_public_url(STORAGE_PATH)
    print(f"   ✅ Thumbnail URL: {public_url}")
    return public_url

async def update_all_products(new_thumbnail_url):
    print("🔎 Fetching all Reading Comprehension products...")
    
    # Fetch all products that are worksheets. 
    # We can filter by resource_type='Worksheet' or tags.
    # Since we know we just generated a bunch of 'Worksheet' types, let's use that.
    response = supabase.table("products").select("id, name").eq("resource_type", "Worksheet").execute()
    products = response.data
    
    print(f"   Found {len(products)} products to update.")
    
    # Update in batches
    batch_size = 50
    for i in range(0, len(products), batch_size):
        batch = products[i:i+batch_size]
        ids = [p['id'] for p in batch]
        
        print(f"   🔄 Updating batch {i}-{i+len(batch)}...")
        
        try:
            supabase.table("products").update({
                "thumbnail_url": new_thumbnail_url,
                # Also update preview_images to be just this one, or include it?
                # User said "have THIS as the thumbnail". Usually preview gallery includes thumbnail.
                "preview_images": [new_thumbnail_url] 
            }).in_("id", ids).execute()
        except Exception as e:
            print(f"   ❌ Error updating batch: {e}")

    print("🎉 All done!")

if __name__ == "__main__":
    url = asyncio.run(upload_static_thumbnail())
    asyncio.run(update_all_products(url))
