import os
from flask import Blueprint, jsonify, request, current_app
from src.infrastructure.databases import get_db_connection
from werkzeug.utils import secure_filename
import traceback

# Định nghĩa Blueprint
menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

# Cấu hình upload
UPLOAD_FOLDER = 'src/static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ==============================================================================
# 1. API GUEST: LẤY MENU CHO KHÁCH (Có JOIN Category)
# URL: GET /api/menu?restaurantId=...
# ==============================================================================
@menu_bp.route('', methods=['GET'])
def get_menu_items():
    restaurant_id = request.args.get('restaurantId')
    if not restaurant_id:
        return jsonify({"error": "Thieu restaurantId"}), 400

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Query lấy tên Category thay vì ID
        query = """
            SELECT 
                m.ItemID, m.ItemName, m.Description, m.Price, m.ImageURL, 
                c.CategoryName, m.IsAvailable
            FROM MenuItems m
            LEFT JOIN MenuCategories c ON m.CategoryID = c.CategoryID
            WHERE m.RestaurantID = ? AND m.IsAvailable = 1
            ORDER BY c.CategoryName, m.ItemName
        """
        
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()

        items = []
        for row in rows:
            items.append({
                "id": row.ItemID,
                "name": row.ItemName,
                "description": row.Description,
                "price": float(row.Price) if row.Price else 0,
                "image": row.ImageURL,
                "category": row.CategoryName if row.CategoryName else "Khác",
                "available": bool(row.IsAvailable)
            })
            
        return jsonify(items), 200

    except Exception as e:
        print(f"❌ Error Guest Menu: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 2. API MANAGER: LẤY MENU CHO QUẢN LÝ (Theo ID)
# URL: GET /api/menu/restaurant/<id>
# Lý do cần: File Menu.tsx của bạn đang gọi đường dẫn này
# ==============================================================================
@menu_bp.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_menu_manager(restaurant_id):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Lấy dữ liệu thô (CategoryID) để quản lý dễ sửa đổi
        query = """
            SELECT ItemID, ItemName, CategoryID, Price, IsAvailable, ImageURL, Description
            FROM MenuItems 
            WHERE RestaurantID = ?
        """
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()

        menu_items = []
        for row in rows:
            menu_items.append({
                "id": row.ItemID,           
                "name": row.ItemName,       
                "categoryId": row.CategoryID, 
                "price": float(row.Price) if row.Price else 0,  
                "available": bool(row.IsAvailable),
                "image": row.ImageURL,
                "description": row.Description
            })

        return jsonify(menu_items), 200

    except Exception as e:
        print(f"❌ Error Manager Menu: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 3. API ADD: THÊM MÓN MỚI (Hỗ trợ Upload File & Link)
# URL: POST /api/menu/add
# ==============================================================================
@menu_bp.route('/add', methods=['POST'])
def add_menu_item():
    conn = None
    try:
        # 1. Lấy dữ liệu form
        restaurant_id = request.form.get('restaurantId', 2) # Mặc định 2
        category_id = request.form.get('categoryId')
        name = request.form.get('name')
        description = request.form.get('description', '')
        price = request.form.get('price')
        image_url_input = request.form.get('imageUrl', '') # Link ảnh (nếu có)
        
        if not name or not price or not category_id:
            return jsonify({"error": "Thiếu thông tin bắt buộc (Tên, Giá, Danh mục)"}), 400

        # 2. Xử lý ảnh (File Upload ưu tiên hơn Link)
        final_image_path = image_url_input
        
        if 'imageFile' in request.files:
            file = request.files['imageFile']
            if file and file.filename != '' and allowed_file(file.filename):
                # Tạo tên file an toàn: res_2_tenfile.jpg
                filename = secure_filename(f"res_{restaurant_id}_{file.filename}")
                
                # Tạo thư mục nếu chưa có
                if not os.path.exists(UPLOAD_FOLDER):
                    os.makedirs(UPLOAD_FOLDER)
                
                # Lưu file
                file.save(os.path.join(UPLOAD_FOLDER, filename))
                
                # Đường dẫn trả về client (giả sử server chạy localhost:5000)
                final_image_path = f"http://localhost:5000/static/uploads/{filename}"

        # 3. Insert vào Database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = """
            INSERT INTO MenuItems (RestaurantID, CategoryID, ItemName, Description, Price, ImageURL, IsAvailable)
            VALUES (?, ?, ?, ?, ?, ?, 1)
        """
        cursor.execute(query, (restaurant_id, category_id, name, description, price, final_image_path))
        conn.commit()
        
        return jsonify({"message": "Thêm món thành công"}), 201

    except Exception as e:
        print(f"❌ Error Add Menu: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()