# File: src/infrastructure/models/user_model.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from src.infrastructure.databases.base import Base 

class UserModel(Base):
    __tablename__ = 'users'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # 🔥 THÊM DÒNG NÀY: Khóa ngoại để nối với bảng restaurants
    restaurant_id = Column(Integer, ForeignKey('restaurants.id'), nullable=True)

    username = Column(String(50), unique=True, nullable=False)
    # Lưu ý: password_hash đã có ở auth_user_model, nhưng nếu bảng users cần lưu riêng thì giữ lại
    # password_hash = Column(String(255), nullable=True) 
    
    full_name = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    
    
    # Dùng chuỗi string "RestaurantModel" để tránh lỗi import vòng lặp
    restaurant = relationship("RestaurantModel", back_populates="users")