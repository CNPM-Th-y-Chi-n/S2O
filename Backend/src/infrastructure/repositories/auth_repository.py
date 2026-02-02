from typing import Optional
from dotenv import load_dotenv
import traceback

# 1. Import các Interface và Model
from src.domain.models.iauth_repository import IAuthRepository
from src.domain.models.auth import Auth
from src.infrastructure.databases.factory_database import FactoryDatabase as db_factory

# 2. Import Model SQL (Entity của Database)
from src.infrastructure.models.auth.auth_user_model import AuthUserModel

load_dotenv()

class AuthRepository(IAuthRepository):
    def __init__(self, session=None):
        # Kết nối DB thông qua Factory
        self.session = db_factory.get_database('MSSQL').session 

    # =========================================================
    # TRIỂN KHAI CÁC PHƯƠNG THỨC TỪ IAuthRepository
    # =========================================================

    def register(self, auth: Auth) -> Optional[Auth]:
        return self.add(auth)

    def login(self, username: str) -> Optional[Auth]:
        return self.get_by_username(username)

    def remember_password(self):
        return None

    def look_account(self, user_id):
        return True

    def un_look_account(self, user_id):
        pass

    # =========================================================
    # LOGIC XỬ LÝ DỮ LIỆU CHI TIẾT
    # =========================================================

    def get_by_username(self, username: str) -> Optional[Auth]:
        """Tìm user trong DB và chuyển đổi sang Domain Model"""
        try:
            # Truy vấn DB
            user_model = self.session.query(AuthUserModel).filter_by(username=username).first()
            
            if not user_model:
                return None
            
            print(f"🔍 [REPO] Tìm thấy user trong DB: {username}, ID thực tế: {user_model.id}")
            
            # 👇 ĐÃ SỬA: Phải truyền id=user_model.id vào để không bị NULL khi Login
            return Auth(
                id=user_model.id, 
                username=user_model.username,
                password=user_model.password, 
                email=user_model.email,
                role=getattr(user_model, 'role', 'Customer')
            )
        except Exception as e:
            print(f"❌ [ERROR REPO] Get User Failed: {e}")
            traceback.print_exc()
            return None
    def update_user_info(self, user_id, new_username=None, new_fullname=None, new_password_hash=None):
        try:
            user = self.session.query(AuthUserModel).filter_by(id=user_id).first()
            if not user:
                return False
            
            if new_username:
                user.username = new_username
            if new_fullname:
                user.fullname = new_fullname
            if new_password_hash:
                user.password = new_password_hash # password ở đây map với PasswordHash trong DB
            
            self.session.commit()
            return True
        except Exception as e:
            self.session.rollback()
            print(f"❌ [REPO ERROR] Update failed: {e}")
            return False

    def add(self, auth: Auth) -> Optional[Auth]:
        try:
            print(f"💾 [REPO] Đang lưu user mới: {auth.username}")
            new_user = AuthUserModel(
                username=auth.username,
                email=auth.email,
                password=auth.password, 
                role="Customer",
                tenant_id=1,
                fullname=auth.username 
            )
            
            self.session.add(new_user)
            self.session.commit()
            self.session.refresh(new_user) 
            
            print(f"✅ [REPO] Lưu thành công. ID mới cấp từ SQL: {new_user.id}")
            
            # Cập nhật ngược lại ID cho object domain
            auth.id = new_user.id 
            return auth
            
        except Exception as e:
            self.session.rollback()
            print(f"❌ [ERROR REPO] Add Failed: {e}")
            return None

    def check_exist(self, username: str) -> bool:
        try:
            self.session.expire_all()
            user = self.session.query(AuthUserModel).filter_by(username=username).first()
            return user is not None
        except Exception: 
            return False