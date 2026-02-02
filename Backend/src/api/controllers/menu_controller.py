from flask import Blueprint, jsonify, request
from src.infrastructure.databases import get_db_connection

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

@menu_bp.route('/', methods=['GET'])
def get_menu_items():
    restaurant_id = request.args.get('restaurantId')
    print(f"\n--- [DEBUG] Request nhận được với RestaurantID: {restaurant_id} ---")

    if not restaurant_id:
        return jsonify({"error": "Thieu restaurantId"}), 400

    conn = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database Connection Failed"}), 500
        
        cursor = conn.cursor()
        
        # 👇 SỬA LỖI Ở ĐÂY: Đổi 'Categories' thành 'MenuCategories'
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
        
        print("⏳ Đang chạy câu lệnh SQL...")
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()
        print(f"✅ SQL thành công! Tìm thấy {len(rows)} món ăn.")

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
        print(f"❌ LỖI CRASH SERVER (500): {e}")
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500
        
    finally:
        if conn:
            conn.close()