from sqlalchemy import text
import random

class AIRepository:
    def __init__(self, session):
        self.session = session

    def get_random_recommendation(self):
        try:
            # SỬA LỖI: Database không có Rating/Description
            # Ta giả lập Rating = 4.5 và Description = 'Quán ngon...' để code không bị lỗi
            sql = text("""
                SELECT TOP 1 
                    RestaurantID, 
                    Name, 
                    Address, 
                    Phone,
                    4.5 AS Rating, 
                    N'Địa điểm ăn uống tuyệt vời' AS Description
                FROM Restaurants 
                ORDER BY NEWID()
            """)
            result = self.session.execute(sql).fetchone()
            return result
        except Exception as e:
            print(f"❌ [Repo Error - Random]: {e}")
            return None

    def search_restaurants(self, keyword=None):
        try:
            if keyword:
                print(f"🔎 [Repo] Tìm kiếm: {keyword}")
                
                # SỬA LỖI:
                # 1. Chỉ tìm trên Name và Address (vì DB không có Description)
                # 2. Giả lập cột Rating và Description
                sql = text("""
                    SELECT TOP 5 
                        RestaurantID, 
                        Name, 
                        Address, 
                        Phone,
                        5.0 AS Rating,
                        N'Món ngon, phục vụ tốt' AS Description
                    FROM Restaurants 
                    WHERE Name LIKE :kw 
                       OR Address LIKE :kw
                    ORDER BY Name ASC
                """)
                
                search_term = f"%{keyword}%"
                result = self.session.execute(sql, {'kw': search_term}).fetchall()
                print(f"✅ [Repo] Tìm thấy {len(result)} kết quả.")
                return result
            else:
                # Top 5 (Mặc định lấy 5 quán đầu tiên vì không có Rating để xếp hạng)
                print(f"🏆 [Repo] Lấy danh sách quán...")
                sql = text("""
                    SELECT TOP 5 
                        RestaurantID, 
                        Name, 
                        Address, 
                        Phone,
                        5.0 AS Rating,
                        N'Nhà hàng nổi bật' AS Description
                    FROM Restaurants 
                    ORDER BY Name ASC
                """)
                result = self.session.execute(sql).fetchall()
                return result

        except Exception as e:
            print(f"❌ [Repo Error]: {e}")
            return []

    def save_chat_log(self, user_id, message, response, restaurant_id=None):
        try:
            # Kiểm tra xem bảng ChatLogs của bạn có khớp cột không
            # Nếu chưa có bảng này thì comment lại để tránh lỗi
            sql = text("""
                INSERT INTO ChatLogs (UserID, Message, Response, RestaurantID, Timestamp)
                VALUES (:uid, :msg, :resp, :rid, GETDATE())
            """)
            self.session.execute(sql, {
                'uid': user_id, 
                'msg': message, 
                'resp': response, 
                'rid': restaurant_id
            })
            self.session.commit()
        except Exception as e:
            print(f"⚠️ [Log Warning]: Không lưu được log (có thể do thiếu bảng ChatLogs): {e}")