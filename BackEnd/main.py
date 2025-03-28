from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Enable CORS to allow front-end requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get all properties
@app.get("/properties", response_model=List[schemas.Property])
def get_properties(db: Session = Depends(get_db)):
    return db.query(models.Property).all()

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
    return query.all()

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