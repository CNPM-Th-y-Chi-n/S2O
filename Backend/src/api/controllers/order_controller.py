from flask import Blueprint, jsonify, request
from src.infrastructure.databases.database_mssql import DatabaseMSSQL
# Import Repository cho phần Lịch sử
from src.infrastructure.repositories.order_repository import OrderRepository

order_bp = Blueprint('order_bp', __name__)

# ==============================================================================
# 1. API: LẤY LỊCH SỬ ĐƠN HÀNG (CÓ LỌC THEO USER)
# URL: /api/orders/history?userId=1
# ==============================================================================
@order_bp.route('/history', methods=['GET'])
def get_order_history():
    try:
        # Lấy userId từ đường dẫn
        user_id = request.args.get('userId')

        if not user_id:
            return jsonify({"error": "Vui lòng đăng nhập để xem lịch sử (Thiếu userId)"}), 400

        db = DatabaseMSSQL()
        repo = OrderRepository(db.session)
        
        # Gọi hàm lọc theo user (Hàm này bạn đã thêm ở bước trước trong Repository)
        orders = repo.get_orders_by_user(user_id)
        
        data = [o.to_dict() for o in orders]
        return jsonify(data), 200
    except Exception as e:
        print(f"❌ Lỗi lấy lịch sử: {e}")
        return jsonify({"error": str(e)}), 500

# ==============================================================================
# 2. API: TẠO ĐƠN HÀNG MỚI (ĐÃ SỬA ĐỂ LƯU USER ID)
# URL: /api/orders/submit
# ==============================================================================
@order_bp.route('/submit', methods=['POST'])
def create_order():
    print("\n--- [DEBUG] Đang tạo đơn hàng... ---")
    conn = None
    try:
        data = request.json
        restaurant_id = data.get('restaurantId')
        table_id = data.get('tableId')
        # 👇 Lấy UserID từ Frontend gửi lên (nếu khách vãng lai thì là None)
        user_id = data.get('userId') 
        items = data.get('items', [])

        if not restaurant_id or not table_id or not items:
            return jsonify({"error": "Thiếu thông tin (Restaurant, Table hoặc Items)"}), 400

        db_helper = DatabaseMSSQL() 
        conn = db_helper.engine.raw_connection() 
        cursor = conn.cursor()
        
        # --- BƯỚC 1: TẠO ORDER (CÓ LƯU USER ID) ---
        # 👇 Đã thêm cột UserID vào câu lệnh INSERT
        create_order_sql = """
            INSERT INTO Orders (RestaurantID, TableID, UserID, OrderStatus, CreatedAt)
            OUTPUT INSERTED.OrderID
            VALUES (?, ?, ?, 'Pending', GETDATE());
        """
        # 👇 Đã thêm biến user_id vào tham số
        cursor.execute(create_order_sql, (restaurant_id, table_id, user_id))
        row = cursor.fetchone()
        
        if not row:
            raise Exception("Lỗi SQL: Không lấy được OrderID.")
            
        order_id = row[0]
        print(f"✅ Đã tạo OrderID: {order_id} cho UserID: {user_id}")

        # --- BƯỚC 2: TẠO ORDER ITEMS ---
        item_sql = """
            INSERT INTO OrderItems (OrderID, ItemID, Quantity, Notes)
            VALUES (?, ?, ?, ?)
        """
        
        for item in items:
            item_id = item.get('id') or item.get('itemId') or item.get('menuItemId')
            quantity = item.get('quantity', 1)
            note = item.get('note', '') or item.get('notes', '')

            if item_id is None:
                raise Exception(f"Dữ liệu món lỗi (thiếu ID): {item}")
            
            cursor.execute(item_sql, (order_id, item_id, quantity, note))

        # --- BƯỚC 3: KHÓA BÀN ---
        print(f"🔒 Đang khóa bàn {table_id}...")
        update_table_sql = """
            UPDATE RestaurantTables 
            SET Status = 'Occupied' 
            WHERE RestaurantID = ? AND TableID = ?
        """
        cursor.execute(update_table_sql, (restaurant_id, table_id))

        conn.commit()
        
        return jsonify({"message": "Order created successfully", "orderId": order_id}), 201

    except Exception as e:
        print(f"❌ LỖI: {e}")
        if conn: conn.rollback()
        return jsonify({"error": "Lỗi xử lý đơn hàng", "details": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 3. API: LẤY ĐƠN HIỆN TẠI (Giữ nguyên)
# ==============================================================================
@order_bp.route('/guest-current', methods=['GET'])
def get_guest_current_order():
    restaurant_id = request.args.get('restaurantId')
    table_id = request.args.get('tableId')
    
    conn = None
    try:
        db_helper = DatabaseMSSQL()
        conn = db_helper.engine.raw_connection()
        cursor = conn.cursor()

        query_order = """
            SELECT TOP 1 OrderID, OrderStatus, CreatedAt
            FROM Orders 
            WHERE RestaurantID = ? AND TableID = ? AND OrderStatus != 'Paid'
            ORDER BY CreatedAt DESC
        """
        cursor.execute(query_order, (restaurant_id, table_id))
        order = cursor.fetchone()

        if not order:
            return jsonify([]), 200 

        order_id = order[0] 
        order_status = order[1]

        query_items = """
            SELECT oi.OrderItemID, m.ItemName, oi.Quantity, m.Price, oi.Notes, m.ImageURL
            FROM OrderItems oi
            JOIN MenuItems m ON oi.ItemID = m.ItemID
            WHERE oi.OrderID = ?
        """
        cursor.execute(query_items, (order_id,))
        rows = cursor.fetchall()

        items = []
        for row in rows:
            items.append({
                "id": row[0],
                "name": row[1],
                "quantity": row[2],
                "price": float(row[3]) if row[3] else 0,
                "note": row[4],
                "image": row[5] if row[5] else "",
                "status": order_status
            })

        return jsonify(items), 200
    except Exception as e:
        print(f"Error getting order: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()