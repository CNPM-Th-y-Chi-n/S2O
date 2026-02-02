# File: src/infrastructure/models/s2o_structures.py

from sqlalchemy import Column, String, Integer, Float, Boolean, ForeignKey, DateTime, JSON, Text, NCHAR
from sqlalchemy.orm import relationship
from datetime import datetime
from src.infrastructure.databases.base import Base 
import random

# ---------------------------------------------------------
# 1. Bảng Nhà Hàng (Restaurants)
# ---------------------------------------------------------
class RestaurantModel(Base):
    __tablename__ = 'Restaurants' 
    
    # Mapping cột SQL -> Python
    id = Column('RestaurantID', Integer, primary_key=True, autoincrement=True)
    tenant_id = Column('TenantID', String(50), nullable=True)
    name = Column('Name', String(255), nullable=False)
    address = Column('Address', String(255), nullable=True)
    phone = Column('Phone', String(20), nullable=True)
    opening_hours = Column('OpeningHours', String(100), nullable=True)
    created_at = Column('CreatedAt', DateTime, default=datetime.utcnow)

    # Quan hệ với bảng con
    items = relationship("MenuItemModel", back_populates="restaurant")
    tables = relationship("TableModel", back_populates="restaurant")

    def to_dict(self):
        # Kho ảnh giả lập
        image_pool = [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
        ]
        
        selected_image = image_pool[self.id % len(image_pool)] if self.id else image_pool[0]

        return {
            "id": self.id,
            "name": self.name,
            "address": self.address if self.address else "Chưa cập nhật địa chỉ",
            "phone": self.phone,
            "image": selected_image,
            "rating": 4.5,
            "reviews": 100,
            "priceRange": "$$",
            "status": "Open",
            "distance": "1.5 km"
        }

# ---------------------------------------------------------
# 2. Bảng Menu Items (Đã Map chuẩn)
# ---------------------------------------------------------
class MenuItemModel(Base):
    __tablename__ = 'MenuItems'
    
    # Mapping cột SQL (Bên trái) -> Code Python (Bên phải)
    id = Column('ItemID', Integer, primary_key=True, autoincrement=True)
    
    restaurant_id = Column('RestaurantID', Integer, ForeignKey('Restaurants.RestaurantID'), nullable=False)
    
    name = Column('ItemName', NCHAR(100), nullable=False)
    
    price = Column('Price', Float, nullable=False)
    
    description = Column('Description', NCHAR(500), nullable=True)
    
    image = Column('ImageURL', String(500), nullable=True) 

    is_available = Column('IsAvailable', Boolean, default=True)

    # Quan hệ
    restaurant = relationship("RestaurantModel", back_populates="items")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "image": self.image if self.image else "https://via.placeholder.com/150"
        }

# ---------------------------------------------------------
# 3. Bảng Tables (ĐÃ SỬA LẠI MAPPING CHO KHỚP SQL)
# ---------------------------------------------------------
class TableModel(Base):
    __tablename__ = 'RestaurantTables'
    
    # Map 'TableID' (Đúng với DB)
    id = Column('TableID', Integer, primary_key=True, autoincrement=True)
    
    # Map 'RestaurantID' (Đúng với DB)
    restaurant_id = Column('RestaurantID', Integer, ForeignKey('Restaurants.RestaurantID'), nullable=False)
    
    # Map 'TableName' (Đúng với DB)
    name = Column('TableName', NCHAR(50), nullable=False)
    
    # Map 'Status' (Đúng với DB)
    status = Column('Status', String(20), default='Available') 

    # ⚠️ QUAN TRỌNG: Database của bạn KHÔNG CÓ cột Capacity, nên ta XÓA dòng mapping đi
    # Nếu muốn dùng QR code thì thêm dòng này (vì DB có cột QRCodeURL)
    qr_code = Column('QRCodeURL', String(500), nullable=True)

    # Quan hệ
    restaurant = relationship("RestaurantModel", back_populates="tables")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            # 👇 Vì DB không lưu số ghế, ta "Fake" tạm là 4 ghế cho Frontend hiển thị đẹp
            "capacity": 4, 
            "status": self.status
        }
    
# 4. Bảng Orders (Đơn hàng)
# ---------------------------------------------------------
class OrderModel(Base):
    __tablename__ = 'Orders'

    # Mapping cột SQL -> Python
    id = Column('OrderID', Integer, primary_key=True, autoincrement=True)
    table_id = Column('TableID', Integer, ForeignKey('RestaurantTables.TableID'), nullable=True)
    restaurant_id = Column('RestaurantID', Integer, ForeignKey('Restaurants.RestaurantID'), nullable=False)
    user_id = Column('UserID', Integer, nullable=True)
    status = Column('OrderStatus', String(50), default='Pending') 
    created_at = Column('CreatedAt', DateTime, default=datetime.utcnow)

    # Quan hệ
    restaurant = relationship("RestaurantModel")
    # Quan hệ với bảng OrderItems
    items = relationship("OrderItemModel", back_populates="order")

    def to_dict(self):
        # Tính tổng tiền: Cộng dồn (Giá món * Số lượng)
        # Lưu ý: Lấy giá hiện tại của món ăn từ menu_item
        total_amount = 0
        formatted_items = []
        
        for item in self.items:
            # Nếu món ăn bị xóa khỏi menu thì đặt giá mặc định là 0 để không lỗi
            price = item.menu_item.price if item.menu_item else 0
            total_amount += price * item.quantity
            formatted_items.append(item.to_dict())

        return {
            "id": str(self.id),
            "restaurantName": self.restaurant.name if self.restaurant else "Unknown Restaurant",
            "restaurantImage": getattr(self.restaurant, 'image', ""), # Lấy ảnh từ logic random trong model Restaurant
            "date": self.created_at.strftime("%b %d, %Y • %I:%M %p"), # Format ngày tháng
            "items": formatted_items,
            "total": total_amount,
            "status": self.status.lower() if self.status else "pending"
        }

# ---------------------------------------------------------
# 5. Bảng OrderItems (Chi tiết món ăn) - ĐÚNG SQL BẠN GỬI
# ---------------------------------------------------------
class OrderItemModel(Base):
    __tablename__ = 'OrderItems' 

    # Mapping cột SQL -> Python
    id = Column('OrderItemID', Integer, primary_key=True, autoincrement=True)
    order_id = Column('OrderID', Integer, ForeignKey('Orders.OrderID'), nullable=False)
    item_id = Column('ItemID', Integer, ForeignKey('MenuItems.ItemID'), nullable=False)
    quantity = Column('Quantity', Integer, default=1)
    notes = Column('Notes', NCHAR(500), nullable=True) # Cột Notes bạn gửi

    # Quan hệ ngược lại Order
    order = relationship("OrderModel", back_populates="items")
    
    # Quan hệ sang MenuItems để lấy Tên món và Giá tiền
    menu_item = relationship("MenuItemModel")

    def to_dict(self):
        return {
            "name": self.menu_item.name if self.menu_item else "Unknown Item",
            "quantity": self.quantity,
            # Lấy giá từ bảng MenuItems
            "price": self.menu_item.price if self.menu_item else 0,
            "notes": self.notes
        }