import os
import glob
import sys
import multiprocessing
from functools import partial
from ord_schema.message_helpers import load_message
from ord_schema.proto import dataset_pb2
from google.protobuf.json_format import MessageToDict
import json
from tqdm import tqdm

def process_file(pb_file, output_dir):
    try:
        dataset = load_message(pb_file, dataset_pb2.Dataset)
        reactions_processed = 0
        
        for reaction in dataset.reactions:
            reaction_dict = MessageToDict(
                message=reaction,
                including_default_value_fields=False,
                preserving_proto_field_name=True,
                use_integers_for_enums=False,
            )
            
            json_filename = f"reaction_{os.path.basename(pb_file)}_{reactions_processed}.json"
            with open(os.path.join(output_dir, json_filename), "w") as f:
                json.dump(reaction_dict, f, indent=2)
            
            reactions_processed += 1
        
        return reactions_processed, pb_file
    except Exception as e:
        return 0, f"Error processing {pb_file}: {str(e)}"

def process_pb_files(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    pb_files = glob.glob(os.path.join(data_dir, "**/*.pb.gz"), recursive=True)
    
    print(f"Found {len(pb_files)} .pb.gz files to process.")
    
    num_processes = multiprocessing.cpu_count()
    pool = multiprocessing.Pool(processes=num_processes)
    
    process_func = partial(process_file, output_dir=output_dir)
    
    total_reactions = 0
    with tqdm(total=len(pb_files), desc="Processing files", unit="file") as pbar:
        for result in pool.imap_unordered(process_func, pb_files):
            reactions_in_file, file_info = result
            total_reactions += reactions_in_file
            pbar.update(1)
            if isinstance(file_info, str):  # This is an error message
                tqdm.write(file_info)
            else:
                tqdm.write(f"Processed {reactions_in_file} reactions from {file_info}")
    
    pool.close()
    pool.join()
    
    print(f"Processed {total_reactions} reactions in total. JSON files saved in {output_dir}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_directory> <output_directory>")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.isdir(input_dir):
        print(f"Error: {input_dir} is not a valid directory")
        sys.exit(1)

    process_pb_files(input_dir, output_dir)
