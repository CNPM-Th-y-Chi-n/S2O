from flask import Blueprint, jsonify, request
from flask_cors import CORS, cross_origin
from src.infrastructure.databases.database_mssql import DatabaseMSSQL
from src.infrastructure.repositories.ai_repository import AIRepository
from src.services.ai_service import AIService
import traceback

ai_bp = Blueprint('ai_bp', __name__)
CORS(ai_bp)

@ai_bp.route('/chat', methods=['POST', 'OPTIONS'])
@cross_origin()
def chat_ai():
    # Xử lý preflight request (cho trình duyệt)
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

    db = None
    try:
        data = request.json
        print(f"📩 [API AI] Nhận request: {data}")
        
        message = data.get('message')
        user_id = data.get('userId') or 1
        restaurant_id = data.get('restaurantId')

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # 1. Kết nối DB
        db = DatabaseMSSQL()
        if not db.session:
            return jsonify({"error": "Lỗi kết nối Database"}), 500

        # 2. Khởi tạo Repo & Service
        repo = AIRepository(db.session)
        service = AIService(repo)
        
        # 3. Xử lý chat
        response = service.process_chat(user_id, message, restaurant_id)
        
        return jsonify({
            "response": response,
            "sender": "ai"
        }), 200

    except Exception as e:
        print(f"❌ [Controller AI] Lỗi nghiêm trọng: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if db: db.close()

# API tạo Menu (Tính năng mở rộng sau này)
@ai_bp.route('/generate-menu', methods=['POST'])
def generate_menu():
    return jsonify({"menu": "Tính năng đang phát triển"}), 200