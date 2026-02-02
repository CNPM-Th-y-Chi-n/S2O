from flask import Blueprint, jsonify, request
from src.infrastructure.databases import get_db_connection
import traceback

# Định nghĩa Blueprint
menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

# ==============================================================================
# 1. API CHO KHÁCH HÀNG (GUEST VIEW) - CODE BẠN VỪA GỬI
# URL: GET /api/menu?restaurantId=2
# Chức năng: Lấy danh sách món ăn kèm Tên Danh Mục (JOIN), chỉ lấy món đang bán.
# ==============================================================================
@menu_bp.route('', methods=['GET'])
def get_menu_public():
    restaurant_id = request.args.get('restaurantId')
    print(f"\n--- [DEBUG] Guest Request nhận được với RestaurantID: {restaurant_id} ---")

    if not restaurant_id:
        return jsonify({"error": "Thieu restaurantId"}), 400

    conn = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database Connection Failed"}), 500
        
        cursor = conn.cursor()
        
        # Câu lệnh SQL: JOIN bảng để lấy CategoryName
        query = """
            SELECT 
                m.ItemID, 
                m.ItemName, 
                m.Description, 
                m.Price, 
                m.ImageURL, 
                c.CategoryName,
                m.IsAvailable
            FROM MenuItems m
            LEFT JOIN MenuCategories c ON m.CategoryID = c.CategoryID
            WHERE m.RestaurantID = ? AND m.IsAvailable = 1
            ORDER BY c.CategoryName, m.ItemName
        """
        
        print("⏳ Đang chạy câu lệnh SQL (Public Menu)...")
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()
        print(f"✅ SQL thành công! Tìm thấy {len(rows)} món ăn cho khách.")

        items = []
        for row in rows:
            items.append({
                "id": row.ItemID,
                "name": row.ItemName,
                "description": row.Description,
                "price": float(row.Price) if row.Price else 0,
                "image": row.ImageURL,
                # Nếu không join được (null) thì để là "Khác"
                "category": row.CategoryName if row.CategoryName else "Khác",
                "available": bool(row.IsAvailable)
            })
            
        return jsonify(items), 200

    except Exception as e:
        print(f"❌ LỖI CRASH SERVER (Public Menu): {e}")
        traceback.print_exc()
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
        
    finally:
        if conn: conn.close()


# ==============================================================================
# 2. API CHO QUẢN LÝ (MANAGER VIEW) - CODE CŨ (GIỮ LẠI ĐỂ KHÔNG LỖI APP)
# URL: GET /api/menu/restaurant/2
# Chức năng: Lấy danh sách món để Admin sửa (cần ID, hiện cả món ẩn)
# ==============================================================================
@menu_bp.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_menu_manager(restaurant_id):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # SQL Query lấy dữ liệu gốc (bao gồm cả ID danh mục)
        query = """
            SELECT ItemID, ItemName, CategoryID, Price, IsAvailable, ImageURL 
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
                "categoryId": row.CategoryID, # Admin cần ID để chỉnh sửa
                "price": float(row.Price),  
                "available": bool(row.IsAvailable),
                "image": row.ImageURL       
            })

        return jsonify(menu_items), 200

    except Exception as e:
        print(f"❌ Lỗi lấy Menu Manager: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()