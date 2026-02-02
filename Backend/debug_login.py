import sys
import os
# Thêm đường dẫn để import được module src
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from dotenv import load_dotenv
from werkzeug.security import check_password_hash
from src.infrastructure.databases.factory_database import FactoryDatabase
from src.infrastructure.models.auth.auth_user_model import AuthUserModel

load_dotenv()

def debug_login_string():
    print("\n🕵️‍♂️ --- BẮT ĐẦU ĐIỀU TRA VỤ ÁN USER 'string' ---")
    
    # 1. Kết nối DB
    try:
        db = FactoryDatabase.get_database('POSTGREE')
        session = db.session
        print("✅ Kết nối Database thành công.")
    except Exception as e:
        print(f"❌ Lỗi kết nối DB: {e}")
        return

    # 2. Lấy User 'string'
    target_user = "string"
    target_pass = "string"
    
    user = session.query(AuthUserModel).filter_by(username=target_user).first()
    
    if not user:
        print(f"❌ KHÔNG TÌM THẤY user '{target_user}' trong bảng auth_users!")
        return

    print(f"✅ Tìm thấy User: {user.username}")
    print(f"🔑 Hash trong DB: {user.password_hash}")

    # 3. THỰC NGHIỆM: So sánh Hash với mật khẩu 'string'
    print(f"\n🧪 Đang thử so sánh Hash với mật khẩu '{target_pass}'...")
    
    is_correct = check_password_hash(user.password_hash, target_pass)
    
    if is_correct:
        print("✅ KẾT QUẢ: TRUE (Mật khẩu đúng!)")
        print("👉 Kết luận: Dữ liệu trong DB hoàn toàn đúng. Lỗi nằm ở CODE CONTROLLER của bạn.")
    else:
        print("❌ KẾT QUẢ: FALSE (Mật khẩu sai!)")
        print("👉 Kết luận: Lúc đăng ký, bạn đã KHÔNG nhập password là 'string'.")
        print("   (Có thể do lỗi Swagger gửi nhầm, hoặc lúc Register code hash bị sai)")

if __name__ == "__main__":
    debug_login_string()