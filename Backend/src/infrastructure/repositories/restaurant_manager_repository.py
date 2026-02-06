from sqlalchemy import text

class RestaurantManagerRepository:
    def __init__(self, session):
        self.session = session

    # 1. Lấy danh sách bàn (Dùng SQL thuần để fix lỗi 500)
    def get_tables_raw(self, restaurant_id):
        try:
            sql = text("""
                SELECT TableID, TableName, Status 
                FROM RestaurantTables 
                WHERE RestaurantID = :rid
            """)
            result = self.session.execute(sql, {"rid": restaurant_id}).fetchall()
            
            tables = []
            for row in result:
                tables.append({
                    "id": row[0],         # Frontend cần 'id'
                    "TableID": row[0],    # Map thêm key gốc
                    "name": row[1],       # Frontend cần 'name'
                    "TableName": row[1],
                    "status": row[2] if row[2] else 'Available'
                })
            return tables
        except Exception as e:
            print(f"❌ [Manager Repo] Error Get Tables: {e}")
            return []

    # 2. Lấy thông tin cơ bản nhà hàng (Header)
    def get_restaurant_basic_info(self, restaurant_id):
        try:
            sql = text("SELECT RestaurantID, Name, Address FROM Restaurants WHERE RestaurantID = :rid")
            row = self.session.execute(sql, {"rid": restaurant_id}).fetchone()
            if row:
                return {
                    "id": row[0],
                    "name": row[1],
                    "address": row[2]
                }
            return None
        except Exception as e:
            print(f"❌ [Manager Repo] Error Get Info: {e}")
            return None

    # 3. Thêm nhà hàng mới (INSERT + Lấy ID ngay lập tức)
    def add_restaurant(self, data):
        try:
            # 👇 SQL đã bổ sung cột OpeningHours
            sql = text("""
                INSERT INTO Restaurants (Name, Address, Phone, Description, ImageURL, OwnerID, OpeningHours, CreatedAt)
                OUTPUT INSERTED.RestaurantID
                VALUES (:name, :addr, :phone, :desc, :img, :owner, :hours, GETDATE())
            """)
            
            result = self.session.execute(sql, {
                "name": data.get('name'),
                "addr": data.get('address'),
                "phone": data.get('phone'),
                "desc": data.get('description') or "", # Nếu null thì lưu chuỗi rỗng
                "img": data.get('imageUrl') or "",
                "owner": data.get('ownerId'),          # Frontend bắt buộc phải gửi cái này
                "hours": data.get('opening_hours')     # 👇 Map tham số giờ mở cửa
            }).fetchone()
            
            self.session.commit()
            return result[0] if result else None
            
        except Exception as e:
            print(f"❌ [Manager Repo] Error Add Restaurant: {e}")
            self.session.rollback()
            return None
    # 4. Lấy danh sách Staff (Thêm hàm này vào TRONG class)
    def get_all_staff(self):
        try:
            # 👇 Đã xóa ", Status" trong câu SQL này
            sql = text("""
                SELECT UserID, FullName, Email, Phone, Role, Username 
                FROM Users 
                WHERE Role IN ('staff', 'kitchen', 'manager')
            """)
            result = self.session.execute(sql).fetchall()
            
            staff_list = []
            for row in result:
                staff_list.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "phone": row[3],
                    "role": row[4],
                    "username": row[5],
                    "active": True  # 👇 Mặc định là True vì DB chưa có cột Status
                })
            return staff_list
        except Exception as e:
            print(f"❌ [Repo] Error Get Staff: {e}")
            return []

    # 5. Thêm Staff (Thêm hàm này vào TRONG class)
    def add_staff_user(self, data):
        try:
            sql = text("""
                INSERT INTO Users (FullName, Email, Phone, Username, PasswordHash, Role, CreatedAt, TenantID)
                OUTPUT INSERTED.UserID
                VALUES (:name, :email, :phone, :username, :password, :role, GETDATE(), :tenant)
            """)
            
            result = self.session.execute(sql, {
                "name": data.get('fullName'),
                "email": data.get('email'),
                "phone": data.get('phone'),
                "username": data.get('username'),
                "password": data.get('passwordHash'), 
                "role": 'staff',
                "tenant": 1
            }).fetchone()
            
            self.session.commit()
            return result[0] if result else None
        except Exception as e:
            print(f"❌ [Repo] Error Add Staff: {e}")
            self.session.rollback()
            return None