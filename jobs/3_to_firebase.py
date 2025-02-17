import os
import json
import asyncio
import firebase_admin
from firebase_admin import credentials, firestore
from tqdm import tqdm
from google.api_core.exceptions import Aborted
import random
import time

# Initialize Firebase Admin SDK
cred = credentials.Certificate("svc_account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

async def read_json_file(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

async def process_batch(batch_files, collection_name, max_retries=5):
    for attempt in range(max_retries):
        try:
            batch = db.batch()
            for file_path in batch_files:
                data = await read_json_file(file_path)
                doc_id = os.path.splitext(os.path.basename(file_path))[0]
                doc_ref = db.collection(collection_name).document(doc_id)
                batch.set(doc_ref, data)
            await asyncio.to_thread(batch.commit)
            return batch_files
        except Aborted as e:
            if "Too much contention on these documents" in str(e):
                print(f"Contention detected on attempt {attempt + 1}. Retrying with exponential backoff...")
                if attempt == max_retries - 1:
                    print(f"Failed to insert batch after {max_retries} attempts due to contention")
                    return []
                wait_time = (2 ** attempt) + (random.randint(0, 1000) / 1000)
                await asyncio.sleep(wait_time)
            else:
                print(f"Unexpected Aborted error on attempt {attempt + 1}: {e}")
                if attempt == max_retries - 1:
                    print(f"Failed to insert batch after {max_retries} attempts")
                    return []
                await asyncio.sleep(1)  # Short delay for non-contention Aborted errors

async def optimized_batch_insert_to_firestore(input_dir, collection_name, checkpoint_file, batch_size=250, max_concurrent_batches=10):
    json_files = [os.path.join(input_dir, f) for f in os.listdir(input_dir) if f.endswith('.json')]
    total_documents = len(json_files)

    # Load checkpoint
    if os.path.exists(checkpoint_file):
        with open(checkpoint_file, 'r') as f:
            processed_files = set(json.load(f))
    else:
        processed_files = set()

    remaining_files = [f for f in json_files if f not in processed_files]
    batches = [remaining_files[i:i + batch_size] for i in range(0, len(remaining_files), batch_size)]
    
    semaphore = asyncio.Semaphore(max_concurrent_batches)
    
    async def process_with_semaphore(batch):
        async with semaphore:
            successful_files = await process_batch(batch, collection_name)
            processed_files.update(successful_files)
            # Update checkpoint after each successful batch
            with open(checkpoint_file, 'w') as f:
                json.dump(list(processed_files), f)
            return len(successful_files)

    with tqdm(total=total_documents, desc="Processing documents", unit="doc") as pbar:
        pbar.update(len(processed_files))  # Update progress bar with already processed files
        for super_batch in [batches[i:i+10] for i in range(0, len(batches), 10)]:
            results = await asyncio.gather(*[process_with_semaphore(batch) for batch in super_batch])
            pbar.update(sum(results))

    print(f"Successfully inserted {len(processed_files)} out of {total_documents} documents into the '{collection_name}' collection.")

if __name__ == "__main__":
    input_directory = "../../jasons_str"
    collection_name = "reactions"
    checkpoint_file = "firestore_insert_checkpoint.json"
    asyncio.run(optimized_batch_insert_to_firestore(input_directory, collection_name, checkpoint_file))