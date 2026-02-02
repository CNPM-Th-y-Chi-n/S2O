from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import jwt
import traceback

# --- IMPORTS ---
from src.services.auth_service import AuthService
from src.infrastructure.repositories.auth_repository import AuthRepository
from src.api.schemas.auth import RigisterUserRequestSchema, RigisterUserResponseSchema

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Khởi tạo instance
auth_repository = AuthRepository() 
auth_service = AuthService(auth_repository)

def decode_auth_token(token):
    try:
        secret = current_app.config.get('SECRET_KEY') or 'super-secret-key-123'
        return jwt.decode(token, secret, algorithms=['HS256'])
    except Exception:
        return None

# =================================================================
# LOGIN
# =================================================================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Vui lòng nhập Username và Password'}), 400

    user = auth_service.login(username, password)
    
    if not user:
        return jsonify({'error': 'Sai tài khoản hoặc mật khẩu'}), 401
    
    try:
        secret = current_app.config.get('SECRET_KEY') or 'super-secret-key-123'
        
        # 🛡️ TRUY VẾT ID: Thử lấy id từ Domain Object hoặc UserID từ DB Model
        user_id_value = getattr(user, 'id', getattr(user, 'UserID', None))
        
        # Nếu vẫn NULL, có thể dữ liệu nằm trong dictionary của object
        if user_id_value is None and hasattr(user, '__dict__'):
            user_id_value = user.__dict__.get('id') or user.__dict__.get('UserID')

        user_role = getattr(user, 'role', getattr(user, 'Role', 'Customer'))
        user_email = getattr(user, 'email', getattr(user, 'Email', ''))
        user_tenant = getattr(user, 'tenant_id', getattr(user, 'TenantID', 1))

        # Ép kiểu ID về số nguyên nếu nó tồn tại
        final_id = int(user_id_value) if user_id_value is not None else None

        payload = {
            'user_id': final_id,
            'username': username,
            'role': user_role,
            'tenant_id': user_tenant,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        
        token = jwt.encode(payload, secret, algorithm='HS256')
        if isinstance(token, bytes): token = token.decode('utf-8')
            
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': final_id,
                'UserID': final_id,
                'username': username,
                'email': user_email,
                'role': user_role,
                'restaurantId': user_tenant 
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Login Error: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Lỗi tạo token hệ thống'}), 500

# =================================================================
# SIGNUP
# =================================================================
@auth_bp.route('/signup', methods=['POST']) 
def register():
    try:
        data = request.json
        new_user = auth_service.register(
            username=data.get('username'),
            password=data.get('password'), 
            email=data.get('email')
        )
        
        if not new_user:
            return jsonify({'message': 'Username đã tồn tại hoặc lỗi tạo User'}), 400

        # Lấy ID sau khi register thành công
        created_id = getattr(new_user, 'id', getattr(new_user, 'UserID', None))
        if created_id is not None:
            created_id = int(created_id)

        return jsonify({
            'message': 'Đăng ký thành công',
            'user': {
                'id': created_id,
                'username': data.get('username'),
                'email': data.get('email')
            }
        }), 201

    except Exception as e:
        print(f"❌ Register Error: {e}")
        traceback.print_exc()
        return jsonify({'message': 'Lỗi hệ thống khi đăng ký'}), 500

# =================================================================
# GET ME
# =================================================================
@auth_bp.route('/me', methods=['GET'])
def get_me():
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({'message': 'Thiếu Token'}), 401
    
    token = auth_header.split(" ")[1]
    user_data = decode_auth_token(token)
    
    if not user_data:
        return jsonify({'message': 'Token hết hạn hoặc không hợp lệ'}), 401
        
    return jsonify({'user': user_data}), 200