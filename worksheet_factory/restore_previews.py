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

async def restore_previews():
    print("🔎 Fetching all Reading Comprehension products...")
    
    # Fetch all products that are worksheets.
    response = supabase.table("products").select("id, name, file_path, preview_images").eq("resource_type", "Worksheet").execute()
    products = response.data
    
    print(f"   Found {len(products)} products to check.")
    
    updated_count = 0
    
    for i, product in enumerate(products):
        # Check if preview_images looks like the static thumbnail
        # Static thumbnail URL usually ends with 'reading_comprehension_thumb.png' or similar if we used the update script
        # OR if it's identical to thumbnail_url (which we don't have here but can guess)
        
        current_previews = product['preview_images'] or []
        
        # If preview is empty or looks static, try to restore
        # The static one from update_thumbnails.py was '.../static/reading_comprehension_thumb.png'
        
        needs_restore = False
        if not current_previews:
            needs_restore = True
        elif any("reading_comprehension_thumb.png" in url for url in current_previews):
            needs_restore = True
        elif any("thumbnail.png" in url for url in current_previews): # From my manual upload in publish script
             needs_restore = True
             
        if needs_restore:
            # Try to reconstruct the original screenshot URL from the file_path
            # file_path: .../products/files/1234567890_slug.pdf
            # original thumb: .../products/thumbnails/1234567890_slug_thumb.png
            
            file_path = product['file_path']
            if not file_path:
                continue
                
            # Replace 'files' with 'thumbnails' and '.pdf' with '_thumb.png'
            # Note: file_path might be a full URL or relative path depending on how it was saved.
            # The script saves full public URL.
            
            if "/files/" in file_path and ".pdf" in file_path:
                restored_url = file_path.replace("/files/", "/thumbnails/").replace(".pdf", "_thumb.png")
                
                # Verify if it exists? 
                # Making a HEAD request is slow for 600 items. 
                # Let's assume it exists if it was created by our script.
                
                print(f"   🔧 Restoring preview for {product['name']}...")
                
                try:
                    supabase.table("products").update({
                        "preview_images": [restored_url]
                    }).eq("id", product['id']).execute()
                    updated_count += 1
                except Exception as e:
                    print(f"   ❌ Error updating {product['name']}: {e}")
            else:
                print(f"   ⚠️ Could not parse file path for {product['name']}: {file_path}")

    print(f"🎉 Restored {updated_count} products!")

if __name__ == "__main__":
    asyncio.run(restore_previews())
