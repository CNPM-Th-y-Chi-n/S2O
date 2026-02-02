from sqlalchemy import text, Column, Integer, String, DateTime, Boolean
from src.infrastructure.databases import Base

# Giữ nguyên UserModel
class UserModel(Base):
    __tablename__ = 'flask_user'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    username = Column(String(18), nullable=False)
    password = Column(String(18), nullable=False)
    description = Column(String(255), nullable=True)
    status = Column(Boolean, nullable=False)
    created_at = Column(DateTime)
    updated_at = Column(DateTime) 

class UserRepository:
    def __init__(self, session):
        self.session = session

    # 1. Hàm lấy thống kê số lượng
    def get_user_stats(self, user_id):
        try:
            # Đếm số lượng yêu thích
            sql = text("SELECT COUNT(*) FROM Favorites WHERE UserID = :uid")
            
            # Chạy lệnh
            count = self.session.execute(sql, {'uid': user_id}).scalar()
            
            # Trả về kết quả
            return {
                "favorites": count if count else 0,
                "orders": 0,   # Tạm thời để 0
                "reviews": 0   # Tạm thời để 0
            }
            
        except Exception as e:
            print(f"❌ [UserRepo] Lỗi lấy stats: {e}")
            return {"favorites": 0, "orders": 0, "reviews": 0}

    # 2. Lấy danh sách chi tiết các quán yêu thích
    def get_user_favorites(self, user_id):
        try:
            print(f"🔎 [Repo] Đang lấy danh sách yêu thích cho User {user_id}...")
            
            # JOIN bảng Favorites với Restaurants
            sql = text("""
                SELECT r.RestaurantID, r.Name, r.Address 
                FROM Favorites f
                JOIN Restaurants r ON f.RestaurantID = r.RestaurantID
                WHERE f.UserID = :uid
            """)
            
            result = self.session.execute(sql, {'uid': user_id}).fetchall()
            
            favorites_list = []
            for row in result:
                favorites_list.append({
                    "id": row[0],
                    "name": row[1],
                    "address": row[2] if row[2] else "Chưa cập nhật địa chỉ"
                })
            
            print(f"✅ [Repo] Tìm thấy {len(favorites_list)} quán yêu thích.")
            return favorites_list
            
        except Exception as e:
            print(f"❌ [UserRepo] Lỗi lấy Favorites: {e}")
            return []
        
    # 3. Hàm XÓA yêu thích (Đã sửa lỗi thụt đầu dòng)
    def remove_user_favorite(self, user_id, restaurant_id):
        try:
            sql = text("DELETE FROM Favorites WHERE UserID = :uid AND RestaurantID = :rid")
            self.session.execute(sql, {'uid': user_id, 'rid': restaurant_id})
            self.session.commit() # Quan trọng: Phải commit thì mới lưu thay đổi vào DB
            return True
        except Exception as e:
            print(f"❌ [Repo] Lỗi xóa favorite: {e}")
            self.session.rollback()
    #4 Ham them yeuthich
    def add_user_favorite(self, user_id, restaurant_id):
        try:
            # Bước 1: Kiểm tra xem đã tồn tại chưa để tránh lỗi trùng
            check_sql = text("SELECT COUNT(*) FROM Favorites WHERE UserID = :uid AND RestaurantID = :rid")
            count = self.session.execute(check_sql, {'uid': user_id, 'rid': restaurant_id}).scalar()
            
            if count > 0:
                print(f"⚠️ [Repo] User {user_id} đã like nhà hàng {restaurant_id} rồi.")
                return True # Coi như thành công vì mục đích là có trong list

            # Bước 2: Thêm mới
            sql = text("INSERT INTO Favorites (UserID, RestaurantID) VALUES (:uid, :rid)")
            self.session.execute(sql, {'uid': user_id, 'rid': restaurant_id})
            self.session.commit()
            print(f"✅ [Repo] Đã thêm Favorite: User {user_id} -> Restaurant {restaurant_id}")
            return True
            
        except Exception as e:
            print(f"❌ [Repo] Lỗi thêm favorite: {e}")
            self.session.rollback()
            return False