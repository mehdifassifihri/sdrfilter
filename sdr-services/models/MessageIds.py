from pydantic import BaseModel
from typing import Dict, List


class MessageIds(BaseModel):
    ids: List[str]