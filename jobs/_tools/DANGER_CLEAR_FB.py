import firebase_admin
from firebase_admin import credentials, firestore
from tqdm import tqdm

# Initialize Firebase Admin SDK
cred = credentials.Certificate("svc_account.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_collection(collection_name, batch_size=500):
    collection_ref = db.collection(collection_name)
    
    # Get total document count
    total_docs = len(list(collection_ref.limit(1000000).stream()))
    
    deleted = 0
    with tqdm(total=total_docs, desc=f"Deleting documents from '{collection_name}'") as pbar:
        while True:
            docs = list(collection_ref.limit(batch_size).stream())
            if not docs:
                break
            
            batch = db.batch()
            for doc in docs:
                batch.delete(doc.reference)
                deleted += 1
            
            batch.commit()
            pbar.update(len(docs))

    print(f"Successfully deleted {deleted} documents from the '{collection_name}' collection.")

if __name__ == "__main__":
    collection_name = "reactions"  # Replace with your collection name
    delete_collection(collection_name)