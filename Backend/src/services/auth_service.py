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
            # 1. Kiểm tra user tồn tại
            if self.repository.check_exist(username):
                print(f"⚠️ [SERVICE] Username '{username}' đã tồn tại!")
                return None
            
            # 2. Mã hóa mật khẩu
            hashed_password = generate_password_hash(password)
            
            # 3. Tạo đối tượng Domain Auth
            # 🔥 ĐÃ SỬA: Xóa passwordcomfirm vì Model SQLAlchemy không chứa cột này
            # 🔥 ĐÃ SỬA: Thêm lại role="Customer" vì trong Model của bạn có tham số này
            auth = Auth(
                username=username,
                password=hashed_password, 
                email=email,
                role="Customer"
            )
            
            # 4. Gọi Repo lưu vào DB
            return self.repository.add(auth)

        except Exception as e:
            print(f"❌ [SERVICE ERROR] Lỗi khi đăng ký: {e}")
            traceback.print_exc() 
            return None

    def login(self, username, password):
        print(f"🚀 [SERVICE] Đang đăng nhập: {username}")
        try:
            # 1. Gọi Repo lấy thông tin User từ DB
            user = self.repository.get_by_username(username)
            
            # 2. Kiểm tra User có tồn tại không
            if not user:
                print("❌ [SERVICE] User không tìm thấy trong DB")
                return None

            # 3. So sánh mật khẩu
            # Dùng getattr để lấy giá trị mật khẩu an toàn (phòng trường hợp tên cột bị đổi)
            db_password = getattr(user, 'password', getattr(user, 'PasswordHash', None))

            if not db_password:
                print("❌ [SERVICE] Không tìm thấy cột mật khẩu trong User Model")
                return None

            if check_password_hash(db_password, password):
                print("✅ [SERVICE] Mật khẩu chính xác!")
                return user
            else:
                print("❌ [SERVICE] Mật khẩu SAI!")
                return None
                
        except Exception as e:
            print(f"💥 [SERVICE CRASH] Lỗi Login: {e}")
            traceback.print_exc() 
            return None

    def check_exist(self, username): 
        return self.repository.check_exist(username)