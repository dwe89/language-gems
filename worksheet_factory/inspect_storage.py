import os
import asyncio
import json
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

async def inspect():
    print("🔎 Inspecting specific product...")
    
    # Get the specific product mentioned by user
    res = supabase.table("products").select("*").ilike("name", "%Environmental Action Verbs%").execute()
    if res.data:
        product = res.data[0]
        print(f"Product: {product['name']}")
        print(f"ID: {product['id']}")
        print(f"File Path: {product['file_path']}")
        print(f"Thumbnail URL: {product['thumbnail_url']}")
        print(f"Preview Images: {product['preview_images']}")
        
        # Try to list files in storage to see what's available
        # We want to see if we can find a thumbnail that matches this product.
        # The file_path usually contains the unique ID/timestamp.
        
        if product['file_path']:
            # Extract filename from URL
            # URL format: .../products/files/1764624753532_filename.pdf
            print("\n🔎 Listing 'previews' bucket (oldest first)...")
            try:
                files = supabase.storage.from_("products").list("previews", {"limit": 100, "sortBy": {"column": "created_at", "order": "asc"}})
                
                print(f"Found {len(files)} files in previews:")
                for f in files[:20]:
                    print(f" - {f['name']} ({f.get('created_at')})")
                    
                # Check for timestamp match
                # Product created_at: 2025-11-26T...
                # File timestamp in name: 1764189978922 (ms) -> 2025-11-26...
                
                if product.get('created_at'):
                    p_time = datetime.fromisoformat(product['created_at'].replace('Z', '+00:00'))
                    print(f"\nProduct Created At: {p_time}")
                    
                    # Look for files with timestamp in name close to p_time
                    # or files with metadata created_at close to p_time
                    
            except Exception as e:
                print(f"Error listing bucket: {e}")

    else:
        print("❌ Product not found!")

if __name__ == "__main__":
    asyncio.run(inspect())
