from typing import Optional
from werkzeug.security import generate_password_hash, check_password_hash
import traceback 
# Import Auth model
from src.domain.models.auth import Auth 

class AuthService:
    def __init__(self, repository):
        self.repository = repository

    def register(self, username, password, email):
        print(f"🚀 [SERVICE] Đăng ký User mới: {username}")
        try:
            if self.repository.check_exist(username):
                print(f"⚠️ [SERVICE] Username '{username}' đã tồn tại!")
                return None
            
            hashed_password = generate_password_hash(password)
            
            auth = Auth(
                username=username,
                password=hashed_password, 
                email=email,
                role="Customer"
            )
            
            return self.repository.add(auth)
        except Exception as e:
            print(f"❌ [SERVICE ERROR] Lỗi khi đăng ký: {e}")
            traceback.print_exc() 
            return None

    def login(self, username, password):
        print(f"🚀 [SERVICE] Đang đăng nhập: {username}")
        try:
            user = self.repository.get_by_username(username)
            
            if not user:
                print(f"❌ [SERVICE] Không tìm thấy Username: {username}")
                return None

            # Lấy chuỗi hash từ DB
            raw_db_password = getattr(user, 'password', None) or \
                              getattr(user, 'PasswordHash', None) or \
                              (user.__dict__.get('password') if hasattr(user, '__dict__') else None)

            # 👇 CẢI TIẾN QUAN TRỌNG: Thêm .strip() để loại bỏ khoảng trắng dư thừa từ SQL CHAR/NCHAR
            db_password = raw_db_password.strip() if raw_db_password else None

            # --- DEBUG ĐÃ CẬP NHẬT ---
            print(f"🔍 [DEBUG] Mật khẩu từ DB (đã strip): '{db_password}'")
            print(f"🔍 [DEBUG] Mật khẩu người dùng nhập: '{password}'")

            if not db_password:
                print("❌ [SERVICE] Lỗi: Không lấy được chuỗi PasswordHash!")
                return None

            # So sánh
            if check_password_hash(db_password, password):
                print("✅ [SERVICE] Đăng nhập thành công!")
                return user
            else:
                print("❌ [SERVICE] Mật khẩu vẫn không khớp!")
                return None
                
        except Exception as e:
            print(f"💥 [SERVICE CRASH]: {e}")
            traceback.print_exc() 
            return None

    def check_exist(self, username): 
        return self.repository.check_exist(username)