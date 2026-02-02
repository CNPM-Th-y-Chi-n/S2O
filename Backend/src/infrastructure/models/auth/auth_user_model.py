from sqlalchemy import Column, Integer, String
# 👇 Đảm bảo đường dẫn import Base đúng với dự án của bạn
# (Nếu lỗi import, thử đổi thành: from src.infrastructure.databases import Base)
from src.infrastructure.databases import Base 

class AuthUserModel(Base):
    # Tên bảng trong SQL Server
    __tablename__ = 'Users'

    # 👇👇👇 DÒNG QUAN TRỌNG ĐỂ SỬA LỖI CRASH APP 👇👇👇
    # Lệnh này cho phép 2 file model cùng trỏ vào 1 bảng mà không đánh nhau
    __table_args__ = {'extend_existing': True}

    # ========================================================
    # MAPPING (Ánh xạ)
    # ========================================================

    # 1. Map 'id' (Python) -> 'UserID' (SQL)
    # Khi code gọi user.id, nó sẽ lấy dữ liệu từ cột UserID
    id = Column('UserID', Integer, primary_key=True, index=True)

    # 2. Map 'username' -> 'Username'
    username = Column('Username', String, unique=True, index=True)

    # 3. Map 'email' -> 'Email'
    email = Column('Email', String)
    
    # 4. Map 'password' -> 'PasswordHash'
    # Lưu ý: Mình đổi tên biến thành 'password' cho khớp với Domain Model
    # Nhưng nó vẫn map vào cột 'PasswordHash' trong DB
    password = Column('PasswordHash', String)

    # 5. Các cột phụ (Nullable)
    tenant_id = Column('TenantID', Integer, default=1, nullable=True)
    fullname = Column('FullName', String, nullable=True)
    role = Column('Role', String, default='Customer')