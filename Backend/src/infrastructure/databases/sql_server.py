import pyodbc

# Cấu hình Database (Sửa lại cho đúng với máy bạn)
SERVER = '127.0.0.1,1433'  # <-- Thay tên máy của bạn vào đây nếu khác
DATABASE = 'SmartRestaurant'
USERNAME = 'sa'             # <-- Thay user của bạn
PASSWORD = '0907365749'            # <-- Thay pass của bạn

def get_db_connection():
    try:
        conn_str = (
            f'DRIVER={{ODBC Driver 17 for SQL Server}};'
            f'SERVER={SERVER};'
            f'DATABASE={DATABASE};'
            f'UID={USERNAME};'
            f'PWD={PASSWORD}'
        )
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        print(f"❌ Lỗi kết nối SQL Server: {e}")
        return None