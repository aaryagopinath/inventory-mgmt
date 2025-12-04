from pydantic import BaseModel
from datetime import date
from typing import Optional

class ItemBase(BaseModel):
    name: str
    quantity: int
    expiry_date: date

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[int] = None
    expiry_date: Optional[date] = None

class Item(ItemBase):
    id: int
    status: str
    notified: bool

    class Config:
        orm_mode = True
