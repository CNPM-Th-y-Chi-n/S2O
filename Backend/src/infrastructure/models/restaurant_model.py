from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.infrastructure.database.mssql import Base
import datetime

class RestaurantModel(Base):
    __tablename__ = 'Restaurants'
    
    RestaurantID = Column(Integer, primary_key=True, autoincrement=True)
    TenantID = Column(Integer, ForeignKey('Users.UserID')) # Giả định TenantID liên kết với UserID
    Name = Column(String(255), nullable=False)
    Address = Column(String(500))
    Phone = Column(String(20))
    OpeningHours = Column(String(100))
    CreatedAt = Column(DateTime, default=datetime.datetime.utcnow)

    # Quan hệ để lấy tên chủ sở hữu (User)
    owner = relationship("AuthUserModel", foreign_keys=[TenantID])