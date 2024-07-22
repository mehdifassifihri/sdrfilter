from pydantic import BaseModel
from typing import Dict

class Filter(BaseModel):
    sdrtype: str
    filters: Dict[str, int]

