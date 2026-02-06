from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from src.infrastructure.databases.database_mssql import DatabaseMSSQL
from src.infrastructure.repositories.admin_repository import AdminRepository
from src.infrastructure.services.admin_service import AdminService

admin_bp = Blueprint("admin_bp", __name__, url_prefix='/api/admin')

# =======================================================
# 1. QUẢN LÝ USERS
# =======================================================

# Lấy danh sách Users
@admin_bp.route("/users", methods=["GET"])
@cross_origin()
def get_users():
    db = None
    try:
        db = DatabaseMSSQL()
        repo = AdminRepository(db.session)
        service = AdminService(repo)
        return jsonify(service.get_users()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# Xóa User
@admin_bp.route("/users/<int:id>", methods=["DELETE"])
@cross_origin()
def delete_user(id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = AdminRepository(db.session)
        service = AdminService(repo)
        
        success = service.delete_user(id)
        if success:
            return jsonify({"message": "User deleted successfully"}), 200
        return jsonify({"error": "Failed to delete user"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# =======================================================
# 2. QUẢN LÝ NHÀ HÀNG (MỚI THÊM)
# =======================================================

# API: Lấy danh sách nhà hàng -> URL: /api/admin/restaurants
@admin_bp.route("/restaurants", methods=["GET"])
@cross_origin()
def get_restaurants():
    db = None
    try:
        db = DatabaseMSSQL()
        repo = AdminRepository(db.session)
        service = AdminService(repo)
        
        # Gọi service lấy danh sách
        return jsonify(service.get_restaurants()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# API: Thêm nhà hàng mới -> URL: /api/admin/restaurants
@admin_bp.route("/restaurants", methods=["POST"])
@cross_origin()
def add_restaurant():
    db = None
    try:
        data = request.json
        # Validate cơ bản
        if not data.get('name'):
            return jsonify({"error": "Tên nhà hàng là bắt buộc"}), 400

        db = DatabaseMSSQL()
        repo = AdminRepository(db.session)
        service = AdminService(repo)
        
        # Gọi service tạo mới
        new_id = service.create_restaurant(data)
        
        if new_id:
            return jsonify({"message": "Tạo nhà hàng thành công", "id": new_id}), 201
        return jsonify({"error": "Lỗi khi lưu vào Database"}), 500
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()