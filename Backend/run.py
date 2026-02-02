#NAM MO A DI DA PHAT
from src.app import create_app
from src.infrastructure.databases.database_mssql import DatabaseMSSQL

# Import Model để đảm bảo Python nhận diện được (quan trọng)
from src.infrastructure.models.s2o_structures import RestaurantModel

app = create_app()


# 👇 COMMENT LẠI HOẶC XÓA HÀM init_database ĐI
# def init_database():
#     db = DatabaseMSSQL()
#     try:
#         from src.infrastructure.databases.base import Base
#         # Base.metadata.create_all(db.engine)  <-- DÒNG NÀY GÂY LỖI
#         print("✅ Đã kiểm tra Schema Database.")
#     except Exception as e:
#         print(f"⚠️ Lỗi init_database: {e}")

if __name__ == "__main__":
    # init_database()  <-- COMMENT LẠI DÒNG NÀY
    
    print("🚀 Server đang khởi động...")
    # Chạy server (tắt debug=True nếu muốn test production, nhưng dev thì cứ để True)
    app.run(host='0.0.0.0', port=5000, debug=True)