from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from apscheduler.schedulers.background import BackgroundScheduler
from app import crud, models, schemas, database, utils
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi import BackgroundTasks
import traceback
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import traceback, sys


models.Base.metadata.create_all(bind=database.engine)
logging.basicConfig(
    level=logging.INFO,  # Set the minimum logging level
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
app = FastAPI()
# Allow requests from your frontend origin
origins = [
    "http://localhost:5173",  # Add Vite dev server
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("CORS middleware applied with origins:", origins)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("\n🔥🔥🔥 UNCAUGHT EXCEPTION 🔥🔥🔥")
    traceback.print_exc()
    print("🔥🔥🔥 END TRACEBACK 🔥🔥🔥\n")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/items/")
def read_items(db: Session = Depends(get_db)):
    return crud.get_items(db)

@app.post("/items/")
def add_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db, item)

@app.delete("/items/{item_id}")
def remove_item(item_id: int, db: Session = Depends(get_db)):
    return crud.delete_item(db, item_id)




@app.put("/items/{item_id}")
def edit_item(item_id: int, item: schemas.ItemUpdate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    try:
        updated_item, notification = crud.update_item(db, item_id, item)
        if not updated_item:
            raise HTTPException(status_code=404, detail="Item not found")

        encoded = jsonable_encoder(updated_item)
        if notification:
            encoded["notification"] = notification
        print("DEBUG: Encoded response:", encoded)
        return JSONResponse(content=encoded)
    except Exception as exc:
        print("\n----- EDIT ITEM ERROR TRACEBACK -----")
        traceback.print_exc(file=sys.stdout)
        print("----- END TRACEBACK -----\n")
        try:
            db_item = crud.get_item(db, item_id)
            print("DEBUG: DB row after attempted update:", {
                "id": getattr(db_item, "id", None),
                "name": getattr(db_item, "name", None),
                "quantity": getattr(db_item, "quantity", None),
                "expiry_date": getattr(db_item, "expiry_date", None),
                "status": getattr(db_item, "status", None),
                "notified": getattr(db_item, "notified", None),
            })
        except Exception as e2:
            print("DEBUG: failed to inspect db_item:", e2)

        return JSONResponse(status_code=500, content={"detail": "Server error - check server logs (traceback printed)."})

# Scheduler for expired items check every hour
# scheduler = BackgroundScheduler()
# scheduler.add_job(lambda: utils.notify_and_delete_expired(database.SessionLocal()), "interval", hours=1)
# scheduler.start()
