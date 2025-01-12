from pydantic import BaseModel
from typing import List

class ExtractReq(BaseModel):
    filename: str
    page_ranges: List[dict]  # A list of dictionaries containing 'start' and 'end' keys
