from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
import jwt
import traceback
from werkzeug.security import generate_password_hash, check_password_hash # Thêm thư viện bảo mật

# --- IMPORTS ---
from src.services.auth_service import AuthService
from src.infrastructure.repositories.auth_repository import AuthRepository
from src.api.schemas.auth import RigisterUserRequestSchema, RigisterUserResponseSchema
from src.infrastructure.models.auth.auth_user_model import AuthUserModel # Import model để dùng trong update

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
# 1. LOGIN (CẬP NHẬT KIỂM TRA ROLE)
# =================================================================
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # 👇 Lấy Role mà người dùng chọn từ Dropdown/Radio ở Frontend
    selected_role = data.get('role') 
    
    if not username or not password:
        return jsonify({'error': 'Vui lòng nhập Username và Password'}), 400

    user = auth_service.login(username, password)
    
    if not user:
        return jsonify({'error': 'Sai tài khoản hoặc mật khẩu'}), 401
    
    # 🛡️ BƯỚC KIỂM TRA ROLE QUAN TRỌNG
    # Lấy role thực sự của User từ Database
    db_role = getattr(user, 'role', getattr(user, 'Role', 'Customer'))
    
    # Nếu người dùng chọn Admin mà DB ghi là Customer (hoặc ngược lại) -> Từ chối
    if selected_role and db_role != selected_role:
        print(f"🚫 [AUTH] User {username} thử đăng nhập với Role {selected_role} nhưng DB là {db_role}")
        return jsonify({
            'error': f'Tài khoản này không có quyền truy cập với vai trò {selected_role}'
        }), 403 # 403 Forbidden: Có tài khoản nhưng không có quyền này

    try:
        secret = current_app.config.get('SECRET_KEY') or 'super-secret-key-123'
        user_id_value = getattr(user, 'id', getattr(user, 'UserID', None))
        
        if user_id_value is None and hasattr(user, '__dict__'):
            user_id_value = user.__dict__.get('id') or user.__dict__.get('UserID')

        user_role = db_role # Sử dụng role từ DB
        user_email = getattr(user, 'email', getattr(user, 'Email', ''))
        user_tenant = getattr(user, 'tenant_id', getattr(user, 'TenantID', 1))
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
# 2. SIGNUP (GIỮ NGUYÊN)
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
# 3. GET ME (GIỮ NGUYÊN)
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

# =================================================================
# 4. UPDATE SETTINGS (HÀM MỚI THÊM VÀO)
# =================================================================
@auth_bp.route('/update-settings', methods=['POST'])
def update_settings():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Unauthorized'}), 401
        
        token = auth_header.split(" ")[1]
        user_data = decode_auth_token(token)
        if not user_data:
            return jsonify({'message': 'Token invalid'}), 401
        
        user_id = user_data.get('user_id')
        data = request.json

        # Tìm user trong DB để lấy password hiện tại
        user_db = auth_repository.session.query(AuthUserModel).filter_by(id=user_id).first()
        if not user_db:
            return jsonify({'message': 'User not found'}), 404

        update_fields = {}
        if data.get('username'): update_fields['new_username'] = data.get('username')
        if data.get('fullname'): update_fields['new_fullname'] = data.get('fullname')

        # Logic đổi mật khẩu
        old_pwd = data.get('oldPassword')
        new_pwd = data.get('newPassword')
        if old_pwd and new_pwd:
            # So khớp pass cũ (giả định pass trong DB đã được hash)
            if not check_password_hash(user_db.password, old_pwd):
                return jsonify({'message': 'Mật khẩu cũ không chính xác'}), 400
            update_fields['new_password_hash'] = generate_password_hash(new_pwd)

        # Gọi repo cập nhật
        success = auth_repository.update_user_info(user_id, **update_fields)
        
        if success:
            return jsonify({'message': 'Cập nhật thành công!'}), 200
        return jsonify({'message': 'Cập nhật thất bại'}), 500

    except Exception as e:
        traceback.print_exc()
        return jsonify({'message': 'Lỗi hệ thống'}), 500