from flask import Flask, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from src.api.swagger import spec

# ==========================================================
# 1. IMPORT CONTROLLERS
# ==========================================================
from src.api.controllers.restaurant_controller import restaurant_bp
from src.api.controllers.order_controller import order_bp 
from src.api.controllers.auth_controller import auth_bp  # 👈 Import Auth
from src.api.controllers.ai_controller import ai_bp
from src.api.controllers.user_controller import user_bp

def create_app():
    app = Flask(__name__)
    
    # 2. Cấu hình CORS (Cho phép mọi nguồn truy cập - Quan trọng cho React)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    app.config['SECRET_KEY'] = 'super-secret-key-123' 

    # ==========================================================
    # 3. ĐĂNG KÝ BLUEPRINT (ROUTER)
    # ==========================================================
    
    # -> API Authentication: /api/auth/signup, /api/auth/login
    app.register_blueprint(auth_bp) 

    # -> API Nhà hàng
    app.register_blueprint(restaurant_bp, url_prefix='/api/restaurants')

    # -> API Đơn hàng
    app.register_blueprint(order_bp, url_prefix='/api/orders')

    # API AI
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    
    # API User
    app.register_blueprint(user_bp, url_prefix='/api/users')

    # 4. Cấu hình Swagger UI
    SWAGGER_URL = '/docs'
    API_URL = '/swagger.json'
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={'app_name': "Smart Restaurant API"}
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    # 5. Route cho file Swagger JSON
    @app.route("/swagger.json")
    def swagger_json():
        return jsonify(spec.to_dict())
    
    # 6. Route trang chủ test
    @app.route('/')
    def home():
        return "✅ Backend SmartRestaurant is running successfully!"

    return app

if __name__ == '__main__':
    app = create_app()
    print("\n🚀 SERVER ĐANG KHỞI ĐỘNG TẠI: http://0.0.0.0:5000")
    # Chạy host 0.0.0.0 để truy cập qua mạng LAN
    app.run(host='0.0.0.0', port=5000, debug=True)