# S2O
Hệ thống Scan To Order

git clone https://github.com/CNPM-Th-y-Chi-n/S2O.git

Backend:
b1: cd src

b2: Tao môi trường ảo:
Bước 1: Tạo môi trường ảo co Python (phiên bản 3.x)
     ## Windows:
     		py -m venv .venv
     ## Unix/MacOS:
     		python3 -m venv .venv
   - Bước 2: Kích hoạt môi trường:
     ## Windows:
     		.venv\Scripts\activate.ps1
     ### Nếu xảy ra lỗi active .venv trên winos run powershell -->Administrator
         Set-ExecutionPolicy RemoteSigned -Force
     ## Unix/MacOS:
     		source .venv/bin/activate
     
   - Bước 3: Cài đặt các thư viện cần thiết
     ## Install:
     		pip install -r requirements.txt
b3: cd ..
b4: pip install psycopg2-binary
pip install pyodbc
pip install PyJWT flask-jwt-extended
pip install flask-bcrypt pyjwt
pip install flask-cors
python -m pip install flask-cors

b5:
chạy lệnh python run.py or py run.py


FRONTEND:
b1 chạy lệnh:
npm intall
npm install react react-dom
npm install -D @types/react @types/react-dom
npm install axios

b2 chạy lệnh
npm install

Để chương trình hoạt động tốt nhất hãy chạy cả 2 thư mục frontend và backend cùng nhau.

Ở thư mục frontend hãy tìm kiếm và thay đổi ip 192.168.1.96 thành ip mạng của bạn để có thể chạy frontend trên các thiết bị cùng mạng LAN hoặc chạy ở trang localhost.

http://192.168.1.96:5173/?restaurantId=2&tableId=3
#Nhà hàng 2 bàn số 3
# Thay ip bằng ip của người dùng
# tìm ip bằng cách mở cmd lệnh ipconfig

Khởi tạo file .env ở thư mục backend
FLASK_ENV=development
SECRET_KEY=your_secret_key_change_this_in_production

DB_TYPE=mssql
DB_USER="Nhap user của bạn"
DB_PASSWORD="Nhap mật khẩu của bạn"
DB_HOST=127.0.0.1
DB_PORT=1433
DB_NAME="SmartRestaurant" //Tendatabase

# Chuỗi kết nối cho SQLAlchemy (Lưu ý %40 thay cho @ trong mật khẩu)
DATABASE_URI="mssql+pymssql://username:password@127.0.0.1:1433/SmartRestaurant(databasename)"


