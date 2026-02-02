from flask import Blueprint, jsonify, request
from src.infrastructure.databases.database_mssql import DatabaseMSSQL
from src.infrastructure.repositories.user_repository import UserRepository

# 1. Tạo Blueprint (nhóm các API liên quan đến User)
user_bp = Blueprint('user_bp', __name__)

# 2. API: Lấy danh sách nhà hàng yêu thích
@user_bp.route('/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites(user_id):
    db = None
    try:
        # Kết nối DB
        db = DatabaseMSSQL()
        repo = UserRepository(db.session)
        
        # Gọi hàm lấy dữ liệu từ Repository (hàm bạn vừa viết ở bước trước)
        favorites = repo.get_user_favorites(user_id)
        
        return jsonify(favorites), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        # Luôn đóng kết nối để tránh lỗi DB
        if db:
            db.close()

# 3. API: Lấy thống kê User (Đơn hàng, Đánh giá, Yêu thích)
# (Cái này dùng cho ProfileScreen hôm qua chúng ta làm)
@user_bp.route('/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = UserRepository(db.session)
        stats = repo.get_user_stats(user_id)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# 4.API xoa yeu thich
@user_bp.route('/<int:user_id>/favorites/<int:restaurant_id>', methods=['DELETE'])
def delete_user_favorite(user_id, restaurant_id):
    db = None
    try:
        db = DatabaseMSSQL()
        repo = UserRepository(db.session)
        
        success = repo.remove_user_favorite(user_id, restaurant_id)
        
        if success:
            return jsonify({"message": "Đã xóa thành công"}), 200
        else:
            return jsonify({"error": "Lỗi khi xóa"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# 5. API them yeu thich
@user_bp.route('/<int:user_id>/favorites', methods=['POST'])
def add_user_favorite_api(user_id):
    db = None
    try:
        # Lấy dữ liệu restaurant_id gửi lên từ Frontend
        data = request.get_json()
        restaurant_id = data.get('restaurant_id')
        
        if not restaurant_id:
            return jsonify({"error": "Thiếu restaurant_id"}), 400

        db = DatabaseMSSQL()
        repo = UserRepository(db.session)
        
        success = repo.add_user_favorite(user_id, restaurant_id)
        
        if success:
            return jsonify({"message": "Đã thêm vào yêu thích"}), 201
        else:
            return jsonify({"error": "Lỗi khi thêm"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()