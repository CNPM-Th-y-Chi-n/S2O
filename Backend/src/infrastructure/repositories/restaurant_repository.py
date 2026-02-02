from src.infrastructure.models.s2o_structures import RestaurantModel, MenuItemModel, TableModel
from sqlalchemy import text # Import này bắt buộc để chạy SQL thuần

class RestaurantRepository:
    def __init__(self, session):
        self.session = session

    # 1. Lấy danh sách nhà hàng
    def get_all(self):
        try:
            return self.session.query(RestaurantModel).all()
        except Exception as e:
            print(f"❌ Lỗi SQL Repository (get_all): {e}")
            return []

    # 2. Lấy chi tiết 1 nhà hàng
    def get_by_id(self, restaurant_id):
        try:
            return self.session.query(RestaurantModel).filter(RestaurantModel.id == restaurant_id).first()
        except Exception as e:
            print(f"❌ Lỗi SQL Repository (get_by_id): {e}")
            return None

    # 3. Lấy Menu (Món ăn)
    def get_menu_by_restaurant(self, restaurant_id):
        try:
            return self.session.query(MenuItemModel).filter(MenuItemModel.restaurant_id == restaurant_id).all()
        except Exception as e:
            print(f"❌ Lỗi lấy Menu: {e}")
            return []

    # 4. Lấy danh sách Bàn
    def get_tables_by_restaurant(self, restaurant_id):
        try:
            return self.session.query(TableModel).filter(TableModel.restaurant_id == restaurant_id).all()
        except Exception as e:
            print(f"❌ Lỗi lấy Bàn: {e}")
            return []

    # ==========================================================
    # 5. 👇 HÀM ĐÃ SỬA: CHẠY SQL THUẦN TRÊN SESSION SQLALCHEMY
    # ==========================================================
    def book_table(self, table_id, user_id):
        try:
            # 1. Sử dụng text() để viết SQL thuần
            # Lưu ý: Trong SQLAlchemy, tham số dùng dấu hai chấm (:param) thay vì dấu hỏi (?)
            sql = text("""
                UPDATE RestaurantTables 
                SET Status = 'Booked', UserID = :uid 
                WHERE TableID = :tid
            """)
            
            # 2. Thực thi thông qua session.execute
            result = self.session.execute(sql, {'uid': user_id, 'tid': table_id})
            
            # 3. Commit để lưu thay đổi vào Database
            self.session.commit()
            
            # 4. Kiểm tra xem có dòng nào được update không
            if result.rowcount > 0:
                print(f"✅ Repo: Đã đặt bàn TableID={table_id} cho UserID={user_id}")
                return True
            else:
                print(f"⚠️ Repo: Không tìm thấy bàn {table_id} để update.")
                return False
                
        except Exception as e:
            print(f"❌ Lỗi SQL book_table: {e}")
            self.session.rollback() # Hoàn tác nếu lỗi
            return False