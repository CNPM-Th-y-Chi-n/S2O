# src/api/controllers/review_controller.py
from flask import Blueprint, request, jsonify
from src.api.controllers.auth_controller import decode_auth_token
from src.infrastructure.repositories.review_repository import ReviewRepository
from src.infrastructure.databases.factory_database import FactoryDatabase

review_bp = Blueprint('review', __name__, url_prefix='/api/reviews')
session = FactoryDatabase.get_database('MSSQL').session
repo = ReviewRepository(session)

@review_bp.route('/my-reviews', methods=['GET'])
def get_my_reviews():
    # 1. Kiểm tra Token để lấy UserID
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({'message': 'Unauthorized'}), 401
    
    token = auth_header.split(" ")[1]
    decoded = decode_auth_token(token)
    
    if not decoded or 'user_id' not in decoded:
        return jsonify({'message': 'Token invalid or expired'}), 401

    user_id = decoded['user_id']

    # 2. Lấy danh sách review từ Repo
    reviews = repo.get_by_user_id(user_id)

    # 3. Format dữ liệu trả về cho Frontend
    result = []
    for r in reviews:
        result.append({
            'reviewId': r.id,
            'restaurantId': r.restaurant_id,
            'rating': r.rating,
            'comment': r.comment,
            'createdAt': r.created_at.strftime("%d/%m/%Y %H:%M")
        })

    return jsonify({'reviews': result}), 200