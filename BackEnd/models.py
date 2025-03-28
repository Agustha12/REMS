from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "User"
    UserID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(50), nullable=False)
    Email = Column(String(50), unique=True, nullable=False)
    Phone = Column(String(15))
    Address = Column(Text)
    Password = Column(String(50), nullable=False)  # Plain text for now
    Role = Column(String(10), nullable=False)

class Location(Base):
    __tablename__ = "Location"
    LocationID = Column(Integer, primary_key=True, index=True)
    TownCity = Column(String(50), nullable=False)
    State = Column(String(50), nullable=False)
    PinCode = Column(String(10))
    Address = Column(Text)
    properties = relationship("Property", back_populates="location")

class Property(Base):
    __tablename__ = "Property"
    PropertyID = Column(Integer, primary_key=True, index=True)
    LocationID = Column(Integer, ForeignKey("Location.LocationID"))
    Size = Column(Integer, nullable=False)
    Type = Column(String(20), nullable=False)
    Cost = Column(Float, nullable=False)
    Status = Column(String(10), nullable=False)
    Features = Column(Text)
    Rating = Column(Float)
    ImageURL = Column(String(255))
    location = relationship("Location", back_populates="properties")

class Enquiry(Base):
    __tablename__ = "Enquiry"
    EnquiryID = Column(Integer, primary_key=True, index=True)
    UserID = Column(Integer, ForeignKey("User.UserID"))
    PropertyID = Column(Integer, ForeignKey("Property.PropertyID"))
    Message = Column(Text, nullable=False)
    Date = Column(Date, nullable=False)