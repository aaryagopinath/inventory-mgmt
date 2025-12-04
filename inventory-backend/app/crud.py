from sqlalchemy.orm import Session
from datetime import date
from . import models, schemas

def get_items(db: Session):
    return db.query(models.Item).all()

def get_item(db: Session, item_id: int):
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
def update_item(db: Session, item_id: int, item_update: schemas.ItemUpdate):
    try:
        db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
        if not db_item:
            return None
        previous_qty = db_item.quantity
        update_data = item_update.dict(exclude_none=True)
        if "name" in update_data:
            db_item.name = update_data["name"]
        if "quantity" in update_data:
            db_item.quantity = int(update_data["quantity"])
        if "expiry_date" in update_data:
            db_item.expiry_date = update_data["expiry_date"]
        notify = previous_qty > 0 and db_item.quantity == 0 and not db_item.notified
        notification = None
        if notify:
            db_item.notified = True
            print("got inside ntify")
            notification = f"Item '{db_item.name}' is now out of stock!"
        else:
            db_item.notified = False
        db.commit()
        db.refresh(db_item)
        return db_item, notification
    except Exception as e:
        print("🔥 CRUD ERROR 🔥", e)
        raise


def delete_item(db: Session, item_id: int):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item

# def check_expired_items(db: Session):
#     today = date.today()
#     expired = db.query(models.Item).filter(models.Item.expiry_date < today).all()
#     for item in expired:
#         item.status = "Expired"
#         db.commit()
#     return expired
