import os

def save_file(file):
    file_path = f"uploads/{file.filename}"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'wb') as f:
        f.write(file.file.read())

def delete_file(file_path: str) -> None:
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"File {file_path} deleted successfully.")
        else:
            print(f"File {file_path} not found.")
    except Exception as e:
        print(f"Error deleting file {file_path}: {e}")
