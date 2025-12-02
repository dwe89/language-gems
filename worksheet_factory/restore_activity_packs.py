import os
import asyncio
from datetime import datetime
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

async def restore_activity_packs_advanced():
    print("🔎 Fetching Activity Pack products...")
    products = supabase.table("products").select("id, name, created_at").ilike("name", "%Activity Pack%").execute().data
    print(f"   Found {len(products)} Activity Packs.")
    
    print("🔎 Listing ALL files in 'previews' and 'thumbnails'...")
    # Helper to list all
    async def list_all(folder):
        all_files = []
        offset = 0
        limit = 100
        while True:
            res = supabase.storage.from_("products").list(folder, {"limit": limit, "offset": offset, "sortBy": {"column": "created_at", "order": "asc"}})
            if not res:
                break
            all_files.extend(res)
            if len(res) < limit:
                break
            offset += limit
        return all_files

    previews = await list_all("previews")
    thumbnails = await list_all("thumbnails")
    print(f"   Found {len(previews)} previews and {len(thumbnails)} thumbnails.")
    
    updated_count = 0
    
    for product in products:
        # Handle timestamp parsing manually to be safe
        # Format: 2025-11-29T21:56:32.52+00:00 or ...Z
        try:
            p_time_str = product['created_at'].replace('Z', '+00:00')
            # Truncate fractional seconds if they cause issues or use a library if available
            # Simple fix: if there is a dot, ensure it has 6 digits or remove it for comparison?
            # Let's try to just parse the first 19 chars (up to seconds)
            p_time = datetime.fromisoformat(p_time_str)
        except ValueError:
             # Fallback: parse up to seconds
             p_time = datetime.fromisoformat(product['created_at'][:19] + "+00:00")
        
        # Find closest preview
        best_preview = None
        min_diff_p = float('inf')
        
        for f in previews:
            if not f.get('created_at'): continue
            f_time = datetime.fromisoformat(f['created_at'].replace('Z', '+00:00'))
            diff = abs((p_time - f_time).total_seconds())
            if diff < min_diff_p:
                min_diff_p = diff
                best_preview = f
        
        # Find closest thumbnail
        best_thumb = None
        min_diff_t = float('inf')
        
        for f in thumbnails:
            if not f.get('created_at'): continue
            f_time = datetime.fromisoformat(f['created_at'].replace('Z', '+00:00'))
            diff = abs((p_time - f_time).total_seconds())
            if diff < min_diff_t:
                min_diff_t = diff
                best_thumb = f
                
        # Threshold: e.g. 5 minutes (300 seconds)
        # The file creation might be slightly before or after product creation depending on script order.
        threshold = 300 
        
        updates = {}
        
        if best_preview and min_diff_p < threshold:
            preview_url = supabase.storage.from_("products").get_public_url(f"previews/{best_preview['name']}")
            updates["preview_images"] = [preview_url]
            # print(f"   Matched Preview: {best_preview['name']} (diff: {min_diff_p:.1f}s)")
        else:
            print(f"   ⚠️ No matching preview for {product['name']} (closest: {min_diff_p:.1f}s)")
            
        if best_thumb and min_diff_t < threshold:
            thumb_url = supabase.storage.from_("products").get_public_url(f"thumbnails/{best_thumb['name']}")
            updates["thumbnail_url"] = thumb_url
            # print(f"   Matched Thumbnail: {best_thumb['name']} (diff: {min_diff_t:.1f}s)")
        else:
            print(f"   ⚠️ No matching thumbnail for {product['name']} (closest: {min_diff_t:.1f}s)")
            
        if updates:
            print(f"   ✅ Restoring {product['name']}...")
            try:
                supabase.table("products").update(updates).eq("id", product['id']).execute()
                updated_count += 1
            except Exception as e:
                print(f"      ❌ Error updating: {e}")

    print(f"🎉 Restored {updated_count} Activity Packs!")

if __name__ == "__main__":
    asyncio.run(restore_activity_packs_advanced())
