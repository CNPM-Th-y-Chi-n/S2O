# File: src/infrastructure/databases/database_mssql.py

from src.infrastructure.databases.abstract_database import AbstractDatabase
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from src.config import Config  # <-- Lấy cấu hình từ đây
from src.infrastructure.databases.base import Base

class DatabaseMSSQL(AbstractDatabase):
    def __init__(self):
        # 1. Lấy chuỗi kết nối từ file Config
        # (Đảm bảo file src/config.py của bạn đã đọc .env và tạo biến này)
        self.connection_string = Config.SQLALCHEMY_DATABASE_URI

        if not self.connection_string:
            print("❌ LỖI: Không tìm thấy SQLALCHEMY_DATABASE_URI trong Config. Kiểm tra lại file .env!")
            self.session = None
            return

        try:
            # 2. Tạo Engine kết nối
            # pool_pre_ping=True giúp tự động kết nối lại nếu bị ngắt
            self.engine = create_engine(self.connection_string, echo=False, pool_pre_ping=True)
            
            # 3. Tạo Session Factory
            self.Session = scoped_session(sessionmaker(bind=self.engine))
            
            # 4. Tạo Session thực sự (Controller sẽ dùng cái này)
            self.session = self.Session()
            
            print("✅ DatabaseMSSQL: Đã khởi tạo Session thành công!")
            
        except Exception as e:
            print(f"❌ Lỗi kết nối DatabaseMSSQL: {e}")
            self.session = None

    def init_database(self, app):
        """Hàm tạo bảng nếu chưa có"""
        try:
            Base.metadata.create_all(bind=self.engine)
            print("✅ Đã kiểm tra/khởi tạo cấu trúc bảng.")
        except Exception as e:
            print(f"⚠️ Lỗi init_database: {e}")

    def close(self):
        """Đóng kết nối khi tắt app"""
        if self.session:
            self.session.close()
            self.Session.remove()