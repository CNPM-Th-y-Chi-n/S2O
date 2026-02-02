from src.api.controllers.todo_controller import bp as todo_bp
from src.api.controllers.auth_controller import auth_bp as auth_bp
from src.api.controllers.restaurant_controller import restaurant_bp 

# ĐĂNG KÝ TẤT CẢ CÁC ROUTE Ở ĐÂY
def register_routes(app):
    app.register_blueprint(todo_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(restaurant_bp, url_prefix='/api/restaurants')