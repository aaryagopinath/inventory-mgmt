from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date
from database import SessionLocal
from models import Item

def check_expired_items():
    db = SessionLocal()
    today = date.today()
    items = db.query(Item).filter(Item.status != "Expired").all()

    for item in items:
        if item.expiry_date < today:
            item.status = "Expired"
            item.notified = True  # mark as notified
            print(f"Item '{item.name}' has expired!")

    db.commit()
    db.close()

# Create scheduler
scheduler = BackgroundScheduler()
# Run every hour
scheduler.add_job(check_expired_items, "interval", hours=1)
scheduler.start()
