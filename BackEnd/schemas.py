from pydantic import BaseModel
from typing import Optional
from datetime import date

class LocationBase(BaseModel):
    TownCity: str
    State: str
    PinCode: Optional[str] = None
    Address: Optional[str] = None

class Location(LocationBase):
    LocationID: int
    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    Size: int
    Type: str
    Cost: float
    Status: str
    Features: Optional[str] = None
    Rating: Optional[float] = None
    ImageURL: Optional[str] = None

class PropertyCreate(PropertyBase):
    LocationID: int

class Property(PropertyBase):
    PropertyID: int
    LocationID: int
    location: Location
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    Name: str
    Email: str
    Phone: Optional[str] = None
    Address: Optional[str] = None
    Role: str

class UserCreate(UserBase):
    Password: str

class User(UserBase):
    UserID: int
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    Email: str
    Password: str

class EnquiryBase(BaseModel):
    Message: str
    Date: date

class EnquiryCreate(EnquiryBase):
    UserID: int
    PropertyID: Optional[int] = None

class Enquiry(EnquiryBase):
    EnquiryID: int
    UserID: int
    PropertyID: Optional[int] = None
    class Config:
        from_attributes = True