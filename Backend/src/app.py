import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint

# --- 1. IMPORT CONTROLLERS ---
from src.api.controllers.auth_controller import auth_bp
from src.api.controllers.restaurant_controller import restaurant_bp
from src.api.controllers.order_controller import order_bp
from src.api.controllers.user_controller import user_bp
from src.api.controllers.ai_controller import ai_bp
from src.api.controllers.review_controller import review_bp
from src.api.controllers.table_controller import table_bp
from src.api.controllers.menu_controller import menu_bp
from src.api.controllers.restaurant_manager_controller import restaurant_manager_bp
from src.api.controllers.restaurant_extra_controller import restaurant_extra_bp
from src.api.controllers.admin_controller import admin_bp

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "super-secret-key-123"

    # --- 2. CẤU HÌNH CORS ---
    CORS(app, resources={r"/*": {"origins": "*"}})

    # --- 3. ĐĂNG KÝ BLUEPRINT (ROUTING) ---
    
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    
    # 👇 SỬA LẠI DÒNG NÀY (XÓA CHỮ 's' CUỐI CÙNG)
    # Cũ: url_prefix="/api/restaurants" -> Sai so với Frontend
    # Mới: url_prefix="/api/restaurant" -> ĐÚNG
    app.register_blueprint(restaurant_bp, url_prefix="/api/restaurants") 

    app.register_blueprint(order_bp, url_prefix="/api/order") 
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")
    app.register_blueprint(review_bp, url_prefix="/api/reviews")
    
    app.register_blueprint(table_bp, url_prefix="/api/table")
    app.register_blueprint(menu_bp, url_prefix="/api/menu")
    app.register_blueprint(restaurant_extra_bp)
    app.register_blueprint(restaurant_manager_bp)
    app.register_blueprint(admin_bp)

    # --- 4. SWAGGER ---
    SWAGGER_URL = "/docs"
    API_URL = "/swagger.json"
    swaggerui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={"app_name": "Smart Restaurant API"})
    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    @app.route("/")
    def index():
        return jsonify({"message": "Server đang chạy ngon lành!"})

    @app.route("/swagger.json")
    def swagger_json():
        try:
            from src.api.swagger import spec
            return jsonify(spec.to_dict())
        except:
            return jsonify({"info": "Swagger spec not found"})

    return app