import time
import json
import logging
from google.cloud import firestore
from elastic_enterprise_search import AppSearch
from tqdm import tqdm
from google.oauth2 import service_account

# Replace these with your actual values
APP_SEARCH_BASE_URL = ""
APP_SEARCH_API_KEY = ""
ENGINE_NAME = "dmitri"  # Replace with your actual engine name
SERVICE_ACCOUNT_FILE = 'svc_account.json'

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def initialize_firestore():
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE,
            scopes=["https://www.googleapis.com/auth/datastore"]
        )
        db = firestore.Client(credentials=credentials, project=credentials.project_id)
        logger.info(f"Firestore initialized with service account credentials for project: {credentials.project_id}")
        return db
    except Exception as e:
        logger.error(f"Failed to initialize Firestore: {e}")
        raise

# Initialize Firestore and App Search clients
firestore_client = initialize_firestore()
app_search = AppSearch(
    APP_SEARCH_BASE_URL,
    bearer_auth=APP_SEARCH_API_KEY
)

def load_checkpoint():
    try:
        with open('sync_checkpoint.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'last_processed_id': None, 'total_processed': 0}

def save_checkpoint(last_processed_id, total_processed):
    checkpoint = {'last_processed_id': last_processed_id, 'total_processed': total_processed}
    with open('sync_checkpoint.json', 'w') as f:
        json.dump(checkpoint, f)

def sync_large_dataset():
    collection_ref = firestore_client.collection('reactions')
    batch_size = 100  # Reduced batch size for App Search
    max_retries = 3
    retry_delay = 5  # seconds

    checkpoint = load_checkpoint()
    last_processed_id = checkpoint['last_processed_id']
    total_processed = checkpoint['total_processed']

    with tqdm(desc="Syncing documents", unit="doc", initial=total_processed) as pbar:
        while True:
            try:
                query = collection_ref.order_by('__name__').limit(batch_size)
                if last_processed_id:
                    last_doc = collection_ref.document(last_processed_id).get()
                    query = query.start_after(last_doc)

                logger.debug("Attempting to fetch documents from Firestore")
                docs = list(query.stream())
                logger.debug(f"Fetched {len(docs)} documents from Firestore")

                if not docs:
                    logger.info('Finished processing all documents')
                    break

                documents_to_index = []
                for doc in docs:
                    doc_dict = doc.to_dict()
                    for key, value in doc_dict.items():
                        if isinstance(value, firestore.DocumentReference):
                            doc_dict[key] = value.path
                    
                    doc_dict['id'] = doc.id  # Ensure each document has an 'id' field
                    documents_to_index.append(doc_dict)
                    last_processed_id = doc.id

                for attempt in range(max_retries):
                    try:
                        logger.debug(f"Attempting to index {len(documents_to_index)} documents to App Search (attempt {attempt + 1})")
                        response = app_search.index_documents(
                            engine_name=ENGINE_NAME,
                            documents=documents_to_index
                        )
                        success = sum(1 for item in response if item['errors'] == [])
                        total_processed += success
                        pbar.update(success)
                        if success < len(documents_to_index):
                            logger.warning(f"Failed to index {len(documents_to_index) - success} documents")
                        break
                    except Exception as e:
                        logger.error(f"Error in indexing operation (attempt {attempt + 1}/{max_retries}): {str(e)}")
                        if attempt < max_retries - 1:
                            logger.info(f"Retrying in {retry_delay} seconds...")
                            time.sleep(retry_delay)
                        else:
                            logger.error(f"Failed to process batch after {max_retries} attempts")
                            raise

                save_checkpoint(last_processed_id, total_processed)

            except Exception as e:
                logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
                logger.info("Saving checkpoint and exiting...")
                save_checkpoint(last_processed_id, total_processed)
                break

    logger.info(f"Total documents processed: {total_processed}")

if __name__ == "__main__":
    try:
        sync_large_dataset()
    except Exception as e:
        logger.error(f"Script terminated due to an error: {e}")