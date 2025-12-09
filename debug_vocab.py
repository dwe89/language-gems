
import os
from supabase import create_client
from dotenv import load_dotenv

# Load .env.local explicitly
load_dotenv(".env.local")

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Missing Supabase credentials in .env.local")
    exit(1)

supabase = create_client(url, key)

def check_vocab():
    print("Checking vocabulary for 'Celebrity culture'...")
    
    # Fetch all words with unit_name containing 'Celebrity culture'
    response = supabase.table("centralized_vocabulary")\
        .select("word, theme_name, unit_name, tier")\
        .eq("language", "es")\
        .eq("exam_board_code", "AQA")\
        .ilike("unit_name", "%Celebrity culture%")\
        .execute()
        
    data = response.data
    print(f"Total words found with unit 'Celebrity culture': {len(data)}")
    
    themes = {}
    for row in data:
        t = row['theme_name']
        if t not in themes:
            themes[t] = 0
        themes[t] += 1
        
    print("\nBreakdown by Theme Name in DB:")
    for t, count in themes.items():
        print(f"  '{t}': {count}")

    print("\n--- Deep Dive: 'Communication and the world around us' ---")
    comm_words = [r for r in data if 'Communication and the world around us' in r['theme_name']]
    print(f"Total words with 'Communication...' theme: {len(comm_words)}")
    
    comm_tiers = {}
    for r in comm_words:
        t = r.get('tier', 'None')
        if t not in comm_tiers:
            comm_tiers[t] = 0
        comm_tiers[t] += 1
        
    print("Tier breakdown for 'Communication...' theme:")
    for t, count in comm_tiers.items():
        print(f"  '{t}': {count}")


    print("\nBreakdown by Unit Name in DB:")
    units = {}
    for row in data:
        u = row['unit_name']
        if u not in units:
            units[u] = 0
        units[u] += 1
    for u, count in units.items():
        print(f"  '{u}': {count}")


    print("\nBreakdown by Tier:")
    tiers = {}
    for row in data:
        t = row.get('tier', 'None')
        if t not in tiers:
            tiers[t] = 0
        tiers[t] += 1
    for t, count in tiers.items():
        print(f"  '{t}': {count}")

if __name__ == "__main__":
    check_vocab()
