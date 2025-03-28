from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import engine, get_db
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Get the absolute path to the images directory
current_dir = os.path.dirname(os.path.abspath(__file__))
images_dir = os.path.join(current_dir, "images")

# Mount the static files directory with absolute path
app.mount("/images", StaticFiles(directory=images_dir), name="images")
logger.info(f"Mounted static files directory at: {images_dir}")

# Add CORS middleware with specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:8000"],  # Allow frontend and backend servers
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Test endpoint to check database
@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    properties = db.query(models.Property).all()
    logger.info(f"Number of properties in database: {len(properties)}")
    return {"count": len(properties), "properties": properties}

# Test endpoint to verify CORS
@app.get("/test-cors")
def test_cors():
    return {"message": "CORS is working correctly!"}

# Get all properties
@app.get("/properties", response_model=List[schemas.Property])
def get_properties(db: Session = Depends(get_db)):
    properties = db.query(models.Property).all()
    logger.info(f"Retrieved {len(properties)} properties")
    return properties

# Search properties with filters
@app.get("/properties/search", response_model=List[schemas.Property])
def search_properties(
    location: Optional[str] = None,
    type: Optional[str] = None,
    max_budget: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Property)
    if location:
        query = query.join(models.Location).filter(
            models.Location.TownCity.ilike(f"%{location}%") |
            models.Location.State.ilike(f"%{location}%")
        )
    if type:
        query = query.filter(models.Property.Type == type)
    if max_budget:
        query = query.filter(models.Property.Cost <= max_budget)
    
    properties = query.all()
    logger.info(f"Search returned {len(properties)} properties")
    return properties

# Get property details by ID
@app.get("/properties/{property_id}", response_model=schemas.Property)
def get_property_details(property_id: int, db: Session = Depends(get_db)):
    property = db.query(models.Property).filter(models.Property.PropertyID == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    logger.info(f"Retrieved property details for ID: {property_id}")
    return property

# User login
@app.post("/login", response_model=schemas.User)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.Email == request.Email).first()
    if not user or user.Password != request.Password:  # Plain text comparison
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user

# Submit an enquiry
@app.post("/enquiries", response_model=schemas.Enquiry)
def create_enquiry(enquiry: schemas.EnquiryCreate, db: Session = Depends(get_db)):
    db_enquiry = models.Enquiry(**enquiry.dict())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return db_enquiry