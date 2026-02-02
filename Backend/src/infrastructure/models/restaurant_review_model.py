# src/infrastructure/models/review/restaurant_review_model.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.infrastructure.databases import Base
from datetime import datetime

class RestaurantReviewModel(Base):
    __tablename__ = 'RestaurantReviews'
    __table_args__ = {'extend_existing': True}

    id = Column("ReviewID", Integer, primary_key=True, autoincrement=True)
    user_id = Column("UserID", Integer, ForeignKey("Users.UserID"), nullable=False)
    restaurant_id = Column("RestaurantID", Integer, nullable=False)
    rating = Column("Rating", Integer, nullable=False)
    comment = Column("Comment", String(1000), nullable=True)
    created_at = Column("CreatedAt", DateTime, default=datetime.utcnow)

    # Nếu bạn có bảng Restaurants, hãy thêm relationship ở đây để lấy tên nhà hàng