import json
import os
import glob
import argparse

def stringify_nested(data, keys_to_stringify):
    for key in keys_to_stringify:
        if key in data:
            data[key] = json.dumps(data[key], ensure_ascii=False)
    return data

def process_file(input_file, output_dir):
    try:
        # Load the JSON data
        with open(input_file, 'r') as file:
            data = json.load(file)

        # List of keys to stringify
        keys_to_stringify = ["identifiers", "inputs", "conditions", "notes", "workups", "outcomes", "provenance"]

        # Stringify nested objects
        stringified_data = stringify_nested(data, keys_to_stringify)

        # Keep the original filename
        output_filename = os.path.basename(input_file)
        output_path = os.path.join(output_dir, output_filename)

        # Write the modified JSON to a new file
        with open(output_path, 'w') as file:
            json.dump(stringified_data, file, indent=2, ensure_ascii=False)

        print(f"Processed: {input_file} -> {output_path}")
    except json.JSONDecodeError as e:
        print(f"Error processing {input_file}: {str(e)}")
    except Exception as e:
        print(f"Unexpected error processing {input_file}: {str(e)}")

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description="Stringify nested objects in JSON files.")
    parser.add_argument("input_dir", help="Input directory containing JSON files")
    parser.add_argument("output_dir", help="Output directory for processed JSON files")
    
    # Parse arguments
    args = parser.parse_args()

    # Create output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)

    # Process all JSON files in the input directory
    for json_file in glob.glob(os.path.join(args.input_dir, '*.json')):
        process_file(json_file, args.output_dir)

    print("Stringification complete. Output files written to", args.output_dir)

if __name__ == "__main__":
    main()