# File: test_db.py
import sys
import os

# Thêm đường dẫn hiện tại
sys.path.append(os.getcwd())

try:
    from src.app import create_app
    # 1. Import hàm khởi tạo từ file mssql.py (thay vì import db)
    from src.infrastructure.databases.mssql import init_mssql
    
    # 2. Import Model để hệ thống nhận diện bảng Restaurant
    from src.infrastructure.models.s2o_structures import RestaurantModel
    
except ImportError as e:
    print("❌ Lỗi Import:")
    print(e)
    exit(1)

# Bắt đầu chạy
app = create_app()

with app.app_context():
    try:
        print("⏳ Đang kết nối tới SQL Server...")
        
        # 3. Gọi hàm này để tạo bảng
        init_mssql(app)
        
        print("\n✅ KẾT NỐI VÀ TẠO BẢNG THÀNH CÔNG!")
        print("Đã thực hiện lệnh tạo bảng trong SQL Server.")
        
    except Exception as e:
        print("\n❌ LỖI KẾT NỐI DATABASE:")
        print(e)