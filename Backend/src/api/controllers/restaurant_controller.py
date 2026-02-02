from flask import Blueprint, jsonify, request
from src.services.restaurant_service import RestaurantService 
from src.infrastructure.repositories.restaurant_repository import RestaurantRepository
from src.infrastructure.databases.database_mssql import DatabaseMSSQL
from sqlalchemy import text 
import traceback
import sys
import datetime

# Tạo Blueprint
restaurant_bp = Blueprint('restaurant_bp', __name__)

# ==============================================================================
# ROUTE 1: LẤY DANH SÁCH NHÀ HÀNG
# ==============================================================================
@restaurant_bp.route('/', methods=['GET'], strict_slashes=False)
def get_restaurants():
    print("➡️ [DEBUG] Bắt đầu xử lý Request GET /restaurants")
    db = None
    try:
        db = DatabaseMSSQL()
        if not db.session:
            return jsonify({"error": "Failed to connect to Database"}), 500

        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        data = service.get_all_restaurants()
        
        return jsonify(data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==============================================================================
# ROUTE 2: LẤY CHI TIẾT NHÀ HÀNG
# ==============================================================================
@restaurant_bp.route('/<int:id>', methods=['GET'], strict_slashes=False)
def get_restaurant_detail(id):
    print(f"➡️ [DEBUG] Bắt đầu lấy chi tiết nhà hàng ID: {id}")
    db = None
    try:
        db = DatabaseMSSQL()
        if not db.session:
            return jsonify({"error": "Database connection failed"}), 500

        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        restaurant = service.get_restaurant_by_id(id)
        
        if restaurant:
            # Xử lý dọn dẹp dữ liệu thừa của SQLAlchemy
            if isinstance(restaurant, dict) and '_sa_instance_state' in restaurant:
                del restaurant['_sa_instance_state']
            return jsonify(restaurant), 200
        else:
            return jsonify({"error": "Restaurant not found"}), 404

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==============================================================================
# ROUTE 3: API ĐẶT BÀN (ĐÃ FIX LỖI USER NULL & INVALID COLUMN)
# ==============================================================================
@restaurant_bp.route('/book-table', methods=['POST'], strict_slashes=False)
def book_table_api():
    print("\n" + "="*50)
    print("🚀 [DEBUG] NHẬN YÊU CẦU ĐẶT BÀN (FIXED VERSION)")
    
    try:
        # 1. Lấy và làm sạch dữ liệu
        data = request.json
        print(f"📦 Payload gốc: {data}")
        
        # Lấy các trường thông tin (Hỗ trợ cả viết hoa và viết thường)
        table_id = data.get('tableId') or data.get('TableID')
        
        # --- FIX QUAN TRỌNG: XỬ LÝ USER ID BỊ 'NULL' (STRING) ---
        raw_user_id = data.get('userId') or data.get('UserID')
        user_id = None
        
        # Nếu gửi lên là chuỗi "null" hoặc rỗng -> Gán mặc định là 1 (Guest)
        if raw_user_id and str(raw_user_id).lower() != 'null':
            try:
                user_id = int(raw_user_id)
            except:
                user_id = 1
        else:
            user_id = 1 # Mặc định là ID 1 nếu không có User đăng nhập
            
        print(f"🔧 UserID sau khi xử lý: {user_id}")

        # Lấy RestaurantID
        res_id = data.get('restaurantId') or data.get('RestaurantID')
        # Nếu không có RestaurantID, mặc định là 1 để tránh lỗi
        final_res_id = res_id if res_id else 1

        # Lấy số khách
        num_guests = data.get('numberOfGuests') or data.get('NumberOfGuests') or 4
        
        # 2. Validate
        if not table_id:
            return jsonify({"message": "Thiếu thông tin TableID"}), 400

        db = DatabaseMSSQL()
        session = db.session

        # 3. THỰC THI SQL TRỰC TIẾP
        
        # A. Kiểm tra bàn
        print("1️⃣ Đang kiểm tra trạng thái bàn...")
        check_sql = text("SELECT Status FROM RestaurantTables WHERE TableID = :tid")
        row = session.execute(check_sql, {'tid': table_id}).fetchone()

        if not row:
            return jsonify({"message": f"Bàn {table_id} không tồn tại trong Database"}), 404
            
        if row[0] == 'Booked':
             return jsonify({"message": "Bàn này đã có người đặt trước đó!"}), 409

        # B. INSERT vào Reservations
        # Lưu ý: Cột ID người dùng là 'UserID' (nếu DB bạn dùng tên khác hãy sửa chỗ này)
        print("2️⃣ Đang tạo Booking History...")
        insert_sql = text("""
            INSERT INTO Reservations 
            (UserID, RestaurantID, TableID, ReservationTime, NumberOfGuests, Status, CreatedAt)
            VALUES (:uid, :rid, :tid, GETDATE(), :guests, 'Pending', GETDATE())
        """)
        
        session.execute(insert_sql, {
            'uid': user_id,
            'rid': final_res_id,
            'tid': table_id,
            'guests': num_guests
        })

        # C. UPDATE trạng thái bàn
        # CHỈ UPDATE STATUS, KHÔNG ĐỤNG VÀO USERID Ở BẢNG NÀY
        print("3️⃣ Đang cập nhật trạng thái bàn...")
        update_sql = text("UPDATE RestaurantTables SET Status = 'Booked' WHERE TableID = :tid")
        session.execute(update_sql, {'tid': table_id})

        # 4. Commit
        session.commit()
        print("✅ THÀNH CÔNG RỰC RỠ!")
        return jsonify({"message": "Đặt bàn thành công!", "status": "Booked"}), 200

    except Exception as e:
        print(f"❌ Lỗi CRASH Controller: {e}")
        traceback.print_exc()
        if 'db' in locals() and db and db.session:
            db.session.rollback()
        return jsonify({"message": "Lỗi Server", "error": str(e)}), 500
    finally:
        if 'db' in locals() and db: db.close()