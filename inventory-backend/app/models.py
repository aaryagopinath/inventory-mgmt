from sqlalchemy import Column, Integer, String, Date, Boolean
from .database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Integer)
    expiry_date = Column(Date)
    status = Column(String, default="Safe")
    notified = Column(Boolean, default=False)
