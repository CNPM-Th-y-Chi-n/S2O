from sqlalchemy import text

class AdminRepository:
    def __init__(self, session):
        self.session = session

    def get_all_users(self):
        try:
            # Lấy tất cả user (trừ mật khẩu)
            sql = text("""
                SELECT UserID, FullName, Email, Role, CreatedAt 
                FROM Users
                ORDER BY CreatedAt DESC
            """)
            result = self.session.execute(sql).fetchall()
            
            users = []
            for row in result:
                users.append({
                    "id": row[0],
                    "name": row[1],
                    "email": row[2],
                    "role": row[3],
                    "createdDate": str(row[4]) if row[4] else "",
                    "lastLogin": "N/A", # DB chưa có cột này, để tạm
                    "status": "Active"  # Mặc định Active như yêu cầu
                })
            return users
        except Exception as e:
            print(f"❌ [Admin Repo] Error Get Users: {e}")
            return []

    def delete_user(self, user_id):
        try:
            # Xóa cứng User khỏi DB
            sql = text("DELETE FROM Users WHERE UserID = :uid")
            self.session.execute(sql, {"uid": user_id})
            self.session.commit()
            return True
        except Exception as e:
            print(f"❌ [Admin Repo] Error Delete User: {e}")
            self.session.rollback()
            return False
    def get_all_restaurants(self):
        try:
            sql = text("""
                SELECT RestaurantID, Name, Address, Phone, Description, Status, CreatedAt 
                FROM Restaurants 
                ORDER BY CreatedAt DESC
            """)
            result = self.session.execute(sql).fetchall()
            
            restaurants = []
            for row in result:
                restaurants.append({
                    "id": row[0],
                    "name": row[1],
                    "address": row[2],
                    "phone": row[3],
                    "status": row[5] if row[5] else "Active", # Mặc định Active
                    "createdAt": str(row[6])
                })
            return restaurants
        except Exception as e:
            print(f"❌ [Admin Repo] Error Get Restaurants: {e}")
            return []

    def add_restaurant(self, data):
        try:
            sql = text("""
                INSERT INTO Restaurants (Name, Address, Phone, Description, OwnerID, OpeningHours, CreatedAt)
                OUTPUT INSERTED.RestaurantID
                VALUES (:name, :addr, :phone, :desc, :owner, :hours, GETDATE())
            """)
            
            result = self.session.execute(sql, {
                "name": data.get('name'),
                "addr": data.get('address'),
                "phone": data.get('phone'),
                "desc": "Mô tả mặc định",
                "owner": 1, # Hardcode tạm admin
                "hours": data.get('opening_hours')
            }).fetchone()
            
            self.session.commit()
            return result[0] if result else None
        except Exception as e:
            print(f"❌ [Admin Repo] Error Add Restaurant: {e}")
            self.session.rollback()
            return None