from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from pydantic import BaseModel

class TodoCreate(BaseModel):
    title: str

class TodoResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class TodoUpdate(BaseModel):
    title: Optional[str] = None