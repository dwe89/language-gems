
import asyncio
from factory import fetch_jobs_from_supabase

def list_topics():
    jobs = fetch_jobs_from_supabase()
    print(f"Total jobs: {len(jobs)}")
    for job in jobs:
        print(f"Topic: {job['topic']} | Display: {job['display_name']}")

if __name__ == "__main__":
    list_topics()
