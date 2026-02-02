from sqlalchemy import Column, Integer, String
from src.infrastructure.databases import Base 

class Auth(Base):
    # 1. Tên bảng chuẩn trong SQL Server
    __tablename__ = 'Users'
    __table_args__ = {'extend_existing': True}

    # =================================================================
    # 2. MAPPING (Ánh xạ)
    # =================================================================
    # Quan trọng: autoincrement=True để SQL Server tự sinh ID
    id = Column("UserID", Integer, primary_key=True, autoincrement=True)
    username = Column("Username", String(50), nullable=False)
    password = Column("PasswordHash", String(255), nullable=False)
    email = Column("Email", String(100), nullable=True)
    role = Column("Role", String(50), nullable=True, default="Customer")
    tenant_id = Column("TenantID", Integer, nullable=True)

    # =================================================================
    # 3. CONSTRUCTOR
    # =================================================================
    def __init__(self, username, password, email, role="Customer", tenant_id=1, id=None):
        self.id = id
        self.username = username
        self.password = password 
        self.email = email
        self.role = role
        self.tenant_id = tenant_id
        # Loại bỏ hoàn toàn passwordcomfirm ở đây để tránh lỗi TypeError 
        # vì nó không thuộc cấu trúc của Model lưu trữ.