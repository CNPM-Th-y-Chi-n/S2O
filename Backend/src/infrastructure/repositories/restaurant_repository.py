from src.infrastructure.models.s2o_structures import RestaurantModel, MenuItemModel, TableModel
from sqlalchemy import text

class RestaurantRepository:
    def __init__(self, session):
        self.session = session

    # 1. Lấy danh sách (Giữ nguyên)
    def get_all(self):
        try: return self.session.query(RestaurantModel).all()
        except: return []

    # 2. Lấy chi tiết (Giữ nguyên - fix tìm ID)
    def get_by_id(self, restaurant_id: int):
        try:
            return self.session.query(RestaurantModel).filter(
                (RestaurantModel.RestaurantID == restaurant_id) if hasattr(RestaurantModel, 'RestaurantID') 
                else (RestaurantModel.id == restaurant_id)
            ).first()
        except: return None

    # 3. Lấy Menu (Giữ nguyên)
    def get_menu_by_restaurant(self, restaurant_id: int):
        try:
            return self.session.query(MenuItemModel).filter(
                (MenuItemModel.RestaurantID == restaurant_id) if hasattr(MenuItemModel, 'RestaurantID')
                else (MenuItemModel.restaurant_id == restaurant_id)
            ).all()
        except: return []

    # 4. Lấy Bàn (Giữ nguyên)
    def get_tables_by_restaurant(self, restaurant_id: int):
        try:
            return self.session.query(TableModel).filter(
                (TableModel.RestaurantID == restaurant_id) if hasattr(TableModel, 'RestaurantID')
                else (TableModel.restaurant_id == restaurant_id)
            ).all()
        except: return []

    # 🆕 5. Check Trạng thái bàn (MỚI)
    def get_table_status(self, table_id):
        try:
            # Dùng SQL thuần để check nhanh
            sql = text("SELECT Status FROM RestaurantTables WHERE TableID = :tid")
            result = self.session.execute(sql, {'tid': table_id}).fetchone()
            if result:
                return result[0] # Trả về chuỗi 'Available', 'Booked'...
            return None
        except Exception as e:
            print(f"❌ Lỗi check table: {e}")
            return None

    # 6. Đặt bàn (Code logic của bạn - Giữ nguyên)
    def book_table(self, table_id: int, user_id: int) -> bool:
        try:
            # Check trước xem bàn có bị booked chưa
            check = self.get_table_status(table_id)
            if not check or check == 'Booked': return False

            sql = text("UPDATE RestaurantTables SET Status = 'Booked', UserID = :uid WHERE TableID = :tid")
            result = self.session.execute(sql, {"uid": user_id, "tid": table_id})
            self.session.commit()
            return result.rowcount > 0
        except Exception as e:
            print(f"❌ Lỗi SQL book_table: {e}")
            self.session.rollback()
            return False

    # 7. Delete & Update (Giữ nguyên logic ORM của bạn)
    def delete(self, restaurant_id: int):
        try:
            res = self.get_by_id(restaurant_id)
            if not res: return False
            self.session.delete(res)
            self.session.commit()
            return True
        except: 
            self.session.rollback()
            return False

    def update(self, restaurant_id: int, data: dict):
        try:
            res = self.get_by_id(restaurant_id)
            if not res: return False
            for k, v in data.items():
                if hasattr(res, k): setattr(res, k, v)
            self.session.commit()
            return True
        except:
            self.session.rollback()
            return False