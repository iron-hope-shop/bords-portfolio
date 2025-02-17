import logging
from elastic_enterprise_search import AppSearch
from tqdm import tqdm

# Replace these with your actual values
APP_SEARCH_BASE_URL = ""
APP_SEARCH_API_KEY = ""
ENGINE_NAME = "dmitri"  # Replace with your actual engine name

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize App Search client
app_search = AppSearch(APP_SEARCH_BASE_URL, bearer_auth=APP_SEARCH_API_KEY)

def delete_all_documents():
    try:
        # Get the total number of documents
        response = app_search.search(engine_name=ENGINE_NAME, query="", page_size=1)
        total_documents = response['meta']['page']['total_results']
        
        logger.info(f"Total documents to delete: {total_documents}")

        # Delete documents in batches
        batch_size = 100
        with tqdm(total=total_documents, desc="Deleting documents", unit="doc") as pbar:
            while True:
                # Get a batch of document IDs
                response = app_search.search(
                    engine_name=ENGINE_NAME,
                    query="",
                    page_size=batch_size
                )
                
                if not response['results']:
                    break
                
                doc_ids = [doc['id']['raw'] for doc in response['results']]
                
                # Delete the batch of documents
                delete_response = app_search.delete_documents(
                    engine_name=ENGINE_NAME,
                    document_ids=doc_ids
                )
                
                deleted_count = sum(1 for item in delete_response if item['deleted'])
                pbar.update(deleted_count)
                
                if deleted_count < len(doc_ids):
                    logger.warning(f"Failed to delete {len(doc_ids) - deleted_count} documents")

        logger.info("Finished deleting all documents")

    except Exception as e:
        logger.error(f"An error occurred while deleting documents: {str(e)}")

if __name__ == "__main__":
    delete_all_documents()