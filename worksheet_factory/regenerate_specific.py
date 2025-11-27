
import asyncio
import os
from factory import fetch_jobs_from_supabase, process_job, OUTPUT_DIR

# Define the targets we want to regenerate
TARGETS = [
    "basics_core_language"
]

async def main():
    print("🚀 Starting targeted regeneration...")
    
    # 1. Fetch all jobs
    all_jobs = fetch_jobs_from_supabase()
    
    # 2. Filter jobs
    selected_jobs = []
    for job in all_jobs:
        topic = job['topic']
        # Check if any target string is in the topic AND language is Spanish
        if any(t in topic for t in TARGETS) and job['language'] == 'es':
            selected_jobs.append(job)
            
    if not selected_jobs:
        print("❌ No matching jobs found.")
        return

    print(f"\nFound {len(selected_jobs)} jobs matching criteria:")
    for job in selected_jobs:
        print(f" - {job['display_name']}")
        
    # 3. Process them
    print(f"\n🚀 Regenerating {len(selected_jobs)} worksheets...\n")
    
    semaphore = asyncio.Semaphore(3)  # Limit concurrent processing
    
    async def process_with_semaphore(job):
        async with semaphore:
            return await process_job(job)
    
    results = await asyncio.gather(*(process_with_semaphore(j) for j in selected_jobs))
    
    # Summary
    success_count = sum(1 for r in results if r)
    print(f"\n" + "="*60)
    print(f"✅ Completed: {success_count}/{len(selected_jobs)} worksheets generated")
    print(f"📁 Output folder: {OUTPUT_DIR}/")
    print("="*60 + "\n")

if __name__ == "__main__":
    asyncio.run(main())
