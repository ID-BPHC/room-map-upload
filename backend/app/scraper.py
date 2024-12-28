import pdfplumber

def scrape_rooms(filename: str, start: int, end: int):
    rooms = []

    # Open the PDF file
    with pdfplumber.open(filename) as pdf:
        for page_number in range(start - 1, end):  # pdfplumber uses 0-based indexing
            print(f"Processing Page {page_number + 1}...")
            
            try:
                page = pdf.pages[page_number]
                table = page.extract_table()
                
                if not table or len(table) < 3:
                    raise ValueError(f"Invalid or empty table on page {page_number + 1}")
                
                # Debugging: Print the table to inspect the structure
                print(f"Data on Page {page_number + 1}:")
                print(table)

                room = {}

                # Extract room details
                room['number'] = table[0][0].split("ROOM NO")[1].strip() if "ROOM NO" in table[0][0] else None
                room['type'] = table[1][0].strip() if table[1][0] else None
                
                # Extract capacities (if present)
                lecture_capacity = table[1][7] if len(table[1]) > 7 else None
                exam_capacity = table[1][9] if len(table[1]) > 9 else None
                room['lectureCapacity'] = int(lecture_capacity) if lecture_capacity and lecture_capacity.isdigit() else None
                room['examCapacity'] = int(exam_capacity) if exam_capacity and exam_capacity.isdigit() else None

                # Extract fixed classes (days: M, T, W, Th, F, S)
                fixed_classes = []
                for i in range(3, len(table)):  # Start from row 3 (day rows)
                    if table[i][0] in ['M', 'T', 'W', 'Th', 'F', 'S']:  # Check valid day
                        day_classes = []
                        for j in range(1, len(table[i])):  
                            day_classes.append(table[i][j].replace("\n", ", ") if table[i][j] else "")
                        
                        # Ensure each day's list has exactly 12 entries
                        while len(day_classes) < 12:
                            day_classes.append("")  # Add empty strings for missing entries
                        
                        fixed_classes.append(day_classes)
                
                room['fixedClasses'] = fixed_classes
                rooms.append(room)

            except Exception as e:
                print(f"Error on Page {page_number + 1}: {str(e)}")
                continue

    return rooms
