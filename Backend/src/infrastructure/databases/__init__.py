# src/infrastructure/databases/__init__.py

# 1. Giữ lại các Class quản lý Database
from src.infrastructure.databases.factory_database import FactoryDatabase
from src.infrastructure.databases.base import Base
from src.infrastructure.databases.database_mssql import DatabaseMSSQL

# 2. Cố gắng import get_db_connection nếu file sql_server.py còn tồn tại
try:
    from .sql_server import get_db_connection
except ImportError:
    pass

