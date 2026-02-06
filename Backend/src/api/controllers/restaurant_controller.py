from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import traceback

from src.infrastructure.services.restaurant_service import RestaurantService
from src.infrastructure.repositories.restaurant_repository import RestaurantRepository
from src.infrastructure.databases.database_mssql import DatabaseMSSQL

restaurant_bp = Blueprint("restaurant_bp", __name__)

# ==========================================================
# 🆕 1. API: LẤY MENU (Fix lỗi 404 MenuPage)
# ==========================================================
@restaurant_bp.route("/menu", methods=["GET"])
@cross_origin()
def get_menu():
    db = None
    try:
        # Lấy restaurantId từ URL (ví dụ: ?restaurantId=3)
        res_id = request.args.get('restaurantId')
        if not res_id:
            return jsonify({"error": "Thiếu restaurantId"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        
        # Gọi service lấy menu
        menu = service.get_menu_list(res_id)
        return jsonify(menu), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 🆕 2. API: CHECK TRẠNG THÁI BÀN (Fix lỗi 404 LandingPage)
# ==========================================================
@restaurant_bp.route("/table/status", methods=["GET"])
@cross_origin()
def check_table_status():
    db = None
    try:
        # Lấy tableId từ URL (ví dụ: ?tableId=1)
        table_id = request.args.get('tableId')
        if not table_id:
            return jsonify({"error": "Thiếu tableId"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        
        # Gọi trực tiếp Repo để check nhanh
        status = repo.get_table_status(table_id)
        
        if status:
            return jsonify({"status": status}), 200
        else:
            return jsonify({"error": "Không tìm thấy bàn"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 3. GET ALL RESTAURANTS (Cho Admin & Customer)
# ==========================================================
@restaurant_bp.route("/", methods=["GET"], strict_slashes=False)
@cross_origin()
def get_restaurants():
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        data = service.get_all_restaurants()
        return jsonify(data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 4. GET RESTAURANT BY ID
# ==========================================================
@restaurant_bp.route("/<int:id>", methods=["GET"], strict_slashes=False)
@cross_origin()
def get_restaurant_detail(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        restaurant = service.get_restaurant_by_id(id)
        if not restaurant:
            return jsonify({"message": "Restaurant not found"}), 404
        return jsonify(restaurant), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 5. BOOK TABLE (Logic đặt bàn cũ của bạn)
# ==========================================================
@restaurant_bp.route("/book-table", methods=["POST"], strict_slashes=False)
@cross_origin()
def book_table_api():
    db = None
    try:
        data = request.json or {}
        table_id = data.get("tableId")
        user_id = int(data.get("userId") or 1) # Mặc định user 1 nếu null

        if not table_id: return jsonify({"message": "Thiếu TableID"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        
        # Kiểm tra và đặt bàn
        if repo.book_table(table_id, user_id):
            return jsonify({"message": "Đặt bàn thành công"}), 200
        else:
            # Nếu repo trả về False (do bàn đã book hoặc lỗi SQL)
            # Bạn có thể check kỹ hơn ở repo để trả về 409 Conflict
            return jsonify({"message": "Bàn đã được đặt hoặc lỗi server"}), 409

    except Exception as e:
        if db: db.session.rollback()
        traceback.print_exc()
        return jsonify({"message": "Server error", "error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 6. DELETE & UPDATE (Giữ nguyên)
# ==========================================================
@restaurant_bp.route("/<int:id>", methods=["DELETE"])
@cross_origin()
def delete_restaurant(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        if service.delete_restaurant(id): return jsonify({"message": "Đã xoá"}), 200
        return jsonify({"message": "Xoá thất bại"}), 400
    except: return jsonify({"error": "Error"}), 500
    finally:
        if db: db.close()

@restaurant_bp.route("/<int:id>", methods=["PUT"])
@cross_origin()
def update_restaurant(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        if service.update_restaurant(id, request.json): return jsonify({"message": "Đã cập nhật"}), 200
        return jsonify({"message": "Cập nhật thất bại"}), 400
    except: return jsonify({"error": "Error"}), 500
    finally:
        if db: db.close()

#7. API XEM BAN THEO NHÀ HÀNG
@restaurant_bp.route("/<int:id>/tables", methods=["GET"])
@cross_origin()
def get_restaurant_tables(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        
        # Gọi Service lấy danh sách bàn
        tables = service.get_tables_by_restaurant(id)
        
        # Trả về danh sách (Frontend sẽ map data này ra giao diện)
        return jsonify(tables), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()