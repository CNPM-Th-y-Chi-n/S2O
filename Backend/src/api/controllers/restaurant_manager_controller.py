from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import traceback

from src.infrastructure.databases.database_mssql import DatabaseMSSQL
from src.infrastructure.repositories.restaurant_manager_repository import RestaurantManagerRepository
from src.infrastructure.services.restaurant_manager_service import RestaurantManagerService

# 👇 Đặt tên unique là "restaurant_manager_new" để tránh lỗi trùng lặp Blueprint
restaurant_manager_bp = Blueprint("restaurant_manager_new", __name__, url_prefix='/api/manager/restaurant')

# =======================================================
# API 1: Lấy danh sách bàn
# =======================================================
@restaurant_manager_bp.route("/<int:id>/tables", methods=["GET"])
@cross_origin()
def get_tables(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantManagerRepository(db.session)
        service = RestaurantManagerService(repo)
        
        tables = service.get_tables(id)
        return jsonify(tables), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# =======================================================
# API 2: Lấy thông tin Header
# =======================================================
@restaurant_manager_bp.route("/<int:id>/info", methods=["GET"])
@cross_origin()
def get_info(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantManagerRepository(db.session)
        service = RestaurantManagerService(repo)
        
        info = service.get_restaurant_info(id)
        if info:
            return jsonify(info), 200
        return jsonify({"error": "Not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# =======================================================
# API 3: Thêm nhà hàng mới
# =======================================================
@restaurant_manager_bp.route('/add', methods=['POST'])
@cross_origin()
def add_restaurant():
    db = None
    try:
        data = request.json if request.is_json else request.form.to_dict()
        if not data.get('name') or not data.get('address'):
            return jsonify({"error": "Tên và địa chỉ là bắt buộc"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantManagerRepository(db.session)
        service = RestaurantManagerService(repo)
        
        new_id = service.create_restaurant(data)
        
        if new_id:
            return jsonify({
                "message": "Thêm nhà hàng thành công!",
                "restaurantId": new_id,
                "name": data.get('name')
            }), 201
        else:
            return jsonify({"error": "Lỗi khi lưu vào Database"}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# =======================================================
# API 4: Lấy danh sách nhân viên (MỚI)
# =======================================================
@restaurant_manager_bp.route("/staff", methods=["GET"])
@cross_origin()
def get_staff():
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantManagerRepository(db.session)
        service = RestaurantManagerService(repo)
        
        staff = service.get_staff_list()
        return jsonify(staff), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# =======================================================
# API 5: Thêm nhân viên mới (MỚI)
# =======================================================
@restaurant_manager_bp.route("/staff/add", methods=["POST"])
@cross_origin()
def add_staff():
    db = None
    try:
        data = request.json
        # Validate dữ liệu đầu vào
        if not data.get('username') or not data.get('password') or not data.get('fullName'):
            return jsonify({"error": "Thiếu thông tin bắt buộc (username, password, fullName)"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantManagerRepository(db.session)
        service = RestaurantManagerService(repo)
        
        new_id = service.create_staff(data)
        
        if new_id:
            return jsonify({"message": "Tạo nhân viên thành công", "id": new_id}), 201
        return jsonify({"error": "Lỗi khi tạo user (Có thể trùng username)"}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()