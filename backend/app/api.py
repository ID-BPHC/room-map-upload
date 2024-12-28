import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.models import ExtractReq
from app.scraper import scrape_rooms
from app.utils import save_file, delete_file
from app.mongo import update_rooms

api_router = APIRouter()

# Endpoint to upload the PDF file
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@api_router.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file to disk
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb") as f:
            f.write(await file.read())

        return {"message": "File uploaded successfully", "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")


# Endpoint to extract room data from the uploaded PDF based on page ranges
@api_router.post("/api/extractRooms")
async def extract_rooms(extract_req: ExtractReq):
    try:
        filename = f"uploads/{extract_req.filename}"
        page_ranges = extract_req.page_ranges  # List of {start, end}
        
        if not filename:
            raise HTTPException(status_code=400, detail="Filename is required")
    
        if not page_ranges or any('start' not in r or 'end' not in r for r in page_ranges):
            raise HTTPException(status_code=400, detail="Both start and end pages must be provided")

        result = []
        errors = []

        for range in page_ranges:
            start_page = range["start"]
            end_page = range["end"]
            try:
                rooms = scrape_rooms(filename, start_page, end_page)
                update_rooms(rooms)  # Update MongoDB with extracted data
                result.append({"start": start_page, "end": end_page, "status": "success"})
            except Exception as e:
                errors.append({"start": start_page, "end": end_page, "error": str(e)})

        # Cleanup: Delete the uploaded file after processing
        delete_file(filename)

        if errors:
            return {"status": "completed with errors", "results": result, "errors": errors}
        else:
            return {"status": "completed successfully", "results": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting rooms: {str(e)}")
   
@api_router.get("/api/ping")
async def test():
    try:
        return {"message": "Online"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")