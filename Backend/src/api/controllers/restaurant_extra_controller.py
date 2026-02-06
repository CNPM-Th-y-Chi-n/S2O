from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
import traceback

# Import các service/repo hiện có
from src.infrastructure.services.restaurant_service import RestaurantService
from src.infrastructure.repositories.restaurant_repository import RestaurantRepository
from src.infrastructure.databases.database_mssql import DatabaseMSSQL

# Vẫn dùng prefix '/api/restaurant' để hứng các request từ Frontend staff
restaurant_extra_bp = Blueprint("restaurant_extra", __name__, url_prefix='/api/restaurant')

# ==========================================================
# 1. API: LẤY CHI TIẾT NHÀ HÀNG (Bổ sung để fix lỗi 404)
# URL: /api/restaurant/<id>
# ==========================================================
@restaurant_extra_bp.route("/<int:id>", methods=["GET"])
@cross_origin()
def get_restaurant_detail(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        
        # Gọi hàm có sẵn trong service
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
# 2. API: LẤY DANH SÁCH BÀN
# URL: /api/restaurant/<id>/tables
# ==========================================================
@restaurant_extra_bp.route("/<int:id>/tables", methods=["GET"])
@cross_origin()
def get_restaurant_tables(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        
        tables = service.get_tables_by_restaurant(id)
        
        return jsonify(tables), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 3. API: LẤY MENU
# URL: /api/restaurant/menu-list (hoặc /menu tùy frontend gọi)
# ==========================================================
@restaurant_extra_bp.route("/menu", methods=["GET"]) 
@cross_origin()
def get_menu_extra():
    db = None
    try:
        res_id = request.args.get('restaurantId')
        if not res_id: return jsonify({"error": "Thiếu restaurantId"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        service = RestaurantService(repo)
        
        menu = service.get_menu_list(res_id)
        return jsonify(menu), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# ==========================================================
# 4. API: CHECK TABLE STATUS
# ==========================================================
@restaurant_extra_bp.route("/table/status", methods=["GET"])
@cross_origin()
def check_table_status_extra():
    db = None
    try:
        table_id = request.args.get('tableId')
        if not table_id: return jsonify({"error": "Thiếu tableId"}), 400

        db = DatabaseMSSQL()
        repo = RestaurantRepository(db.session)
        status = repo.get_table_status(table_id)
        
        if status: return jsonify({"status": status}), 200
        else: return jsonify({"error": "Không tìm thấy bàn"}), 404
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()