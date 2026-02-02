# File: check_users.py
import sys
import os

# 🔥 QUAN TRỌNG: Thêm thư mục 'src' vào đường dẫn để Python tìm thấy code
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from dotenv import load_dotenv
from src.infrastructure.databases.factory_database import FactoryDatabase
# Import model
from src.infrastructure.models.auth.auth_user_model import AuthUserModel

load_dotenv()

def list_all_users():
    print("----- KIỂM TRA DỮ LIỆU USER TRONG DB -----")
    try:
        # Lấy Database POSTGREE (như trong Repository của bạn)
        db = FactoryDatabase.get_database('POSTGREE') 
        session = db.session
        
        # Query tất cả user
        users = session.query(AuthUserModel).all()
        
        if not users:
            print("❌ Bảng 'auth_users' TRỐNG RỖNG! (Chưa đăng ký thành công)")
        else:
            print(f"✅ Tìm thấy {len(users)} users trong bảng 'auth_users':")
            print("-" * 60)
            for u in users:
                # In ra Username và một phần Password Hash để kiểm tra
                # Nếu Hash ngắn cũn (ví dụ '123') -> Lỗi chưa mã hóa
                pass_display = u.password_hash if u.password_hash else "NULL"
                if len(pass_display) > 20:
                    pass_display = pass_display[:20] + "..."
                
                print(f"🆔 ID: {u.id} | 👤 User: '{u.username}' | 🔑 Hash: {pass_display}")
            print("-" * 60)
                
    except Exception as e:
        print(f"❌ Lỗi kết nối hoặc query: {e}")

if __name__ == "__main__":
    list_all_users()