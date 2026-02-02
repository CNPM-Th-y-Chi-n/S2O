import os
import urllib.parse
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

class FactoryConfig:
    """Factory to get configuration based on environment."""
    @staticmethod
    def get_config(env: str):
        if env == 'development':
            return DevelopmentConfig
        elif env == 'testing':
            return TestingConfig
        elif env == 'production':
            return ProductionConfig
        else:
            return Config

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key'
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1']
    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', '1']
    CORS_HEADERS = 'Content-Type'

    # --- CẤU HÌNH KẾT NỐI SQL SERVER ---
    # Ưu tiên lấy từ .env, nếu không có mới dùng giá trị mặc định (fallback)
    SERVER = os.environ.get('DB_HOST') or '127.0.0.1,1433'
    DATABASE = os.environ.get('DB_NAME') or 's2o_db'
    USERNAME = os.environ.get('DB_USER') or 'sa'
    PASSWORD = os.environ.get('DB_PASSWORD') or '0907365749'
    DRIVER = os.environ.get('DB_DRIVER') or 'ODBC Driver 17 for SQL Server'

    # Tạo chuỗi kết nối an toàn (Encode ký tự đặc biệt)
    params = urllib.parse.quote_plus(
        f"DRIVER={{{DRIVER}}};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        f"UID={USERNAME};"
        f"PWD={PASSWORD};"
        f"Encrypt=no;"
        f"TrustServerCertificate=yes;"
    )
    
    # Chuỗi kết nối dùng cho SQLAlchemy
    SQLALCHEMY_DATABASE_URI = f"mssql+pyodbc:///?odbc_connect={params}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Alias cho code cũ nếu cần
    DATABASE_URI = SQLALCHEMY_DATABASE_URI

    # Print ra log để debug xem đang kết nối vào đâu (Chỉ hiện 3 ký tự đầu pass)
    print(f"🔌 Connecting to MSSQL: {SERVER} / DB: {DATABASE}")

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:' # Test nên dùng SQLite in-memory cho nhanh

class ProductionConfig(Config):
    DEBUG = False

# --- SWAGGER CONFIG (Giữ nguyên) ---
class SwaggerConfig:
    template = {
        "swagger": "2.0",
        "info": {
            "title": "S2O API",
            "description": "API for Restaurant Management",
            "version": "1.0.0"
        },
        "basePath": "/",
        "schemes": ["http", "https"],
        "consumes": ["application/json"],
        "produces": ["application/json"]
    }
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"
    }