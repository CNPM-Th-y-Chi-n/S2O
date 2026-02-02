from flask import Blueprint, jsonify, request
from src.infrastructure.databases import get_db_connection
import traceback # Để in lỗi chi tiết hơn

# URL Prefix: /api/order
order_bp = Blueprint('order', __name__, url_prefix='/api/order')

# ==============================================================================
# 1. API ĐẶT MÓN (SUBMIT ORDER) - KHÁCH HÀNG
# ==============================================================================
@order_bp.route('/submit', methods=['POST'])
def submit_order():
    conn = None
    try:
        data = request.json
        print(f"\n📦 [SUBMIT] Dữ liệu nhận được: {data}")

        table_id = data.get('tableId')
        restaurant_id = data.get('restaurantId')
        items = data.get('items', []) 

        if not table_id or not items:
            return jsonify({"error": "Thiếu thông tin"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Insert Order
            query_order = """
                INSERT INTO Orders (TableID, RestaurantID, OrderStatus, CreatedAt)
                OUTPUT INSERTED.OrderID
                VALUES (?, ?, 'Pending', GETDATE())
            """
            cursor.execute(query_order, (table_id, restaurant_id))
            row = cursor.fetchone()
            if not row: raise Exception("Lỗi Insert Order")
            order_id = row[0]

            # Insert Items
            query_detail = """
                INSERT INTO OrderItems (OrderID, ItemID, Quantity, Notes)
                VALUES (?, ?, ?, ?)
            """
            for item in items:
                cursor.execute(query_detail, (order_id, item.get('itemId'), item.get('quantity'), item.get('note', '')))

            conn.commit()
            return jsonify({"message": "Thành công!", "orderId": order_id}), 201

        except Exception as db_err:
            if conn: conn.rollback()
            print(f"❌ LỖI SQL SUBMIT: {db_err}")
            return jsonify({"error": str(db_err)}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 2. API LẤY ĐƠN HÀNG HIỆN TẠI (GUEST CURRENT) - KHÁCH HÀNG
# ==============================================================================
@order_bp.route('/guest-current', methods=['GET'])
def get_current_guest_order():
    conn = None
    try:
        restaurant_id = request.args.get('restaurantId')
        table_id = request.args.get('tableId')
        
        if not restaurant_id or not table_id:
            return jsonify({"error": "Thiếu restaurantId hoặc tableId"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Tìm đơn hàng chưa hoàn thành
        query_find = """
            SELECT TOP 1 OrderID, OrderStatus, CreatedAt
            FROM Orders
            WHERE RestaurantID = ? 
              AND TableID = ? 
              AND OrderStatus NOT IN ('Completed', 'Cancelled', 'Paid')
            ORDER BY CreatedAt DESC
        """
        cursor.execute(query_find, (restaurant_id, table_id))
        order_row = cursor.fetchone()

        if not order_row:
            return jsonify({"message": "Không có đơn hàng nào đang phục vụ"}), 404

        order_id = order_row[0]
        status = order_row[1]
        created_at = order_row[2]

        # Lấy chi tiết món ăn
        query_items = """
            SELECT oi.ItemID, m.ItemName, oi.Quantity, m.Price, oi.Notes, m.ImageURL
            FROM OrderItems oi
            JOIN MenuItems m ON oi.ItemID = m.ItemID
            WHERE oi.OrderID = ?
        """
        cursor.execute(query_items, (order_id,))
        item_rows = cursor.fetchall()

        items_data = []
        total_price = 0

        for row in item_rows:
            price = float(row[3]) if row[3] else 0
            qty = row[2]
            total_price += price * qty
            
            items_data.append({
                "itemId": row[0],
                "name": row[1],
                "quantity": qty,
                "price": price,
                "note": row[4],
                "image": row[5],
                "status": status 
            })

        return jsonify({
            "orderId": order_id,
            "status": status,
            "createdAt": created_at,
            "items": items_data,
            "totalAmount": total_price
        }), 200

    except Exception as e:
        print(f"❌ LỖI GET ORDER: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 3. API LỊCH SỬ ĐƠN HÀNG (HISTORY) - KHÁCH HÀNG
# ==============================================================================
@order_bp.route('/history', methods=['GET'])
def get_order_history():
    conn = None
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "Thiếu userId"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT 
                o.OrderID, o.CreatedAt, o.OrderStatus,
                oi.ItemID, m.ItemName, oi.Quantity, m.Price, m.ImageURL
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
            LEFT JOIN MenuItems m ON oi.ItemID = m.ItemID
            WHERE o.UserID = ? 
            ORDER BY o.CreatedAt DESC
        """
        
        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()

        orders_dict = {}
        
        for row in rows:
            order_id = row.OrderID
            
            if order_id not in orders_dict:
                orders_dict[order_id] = {
                    "id": order_id,
                    "date": row.CreatedAt,
                    "status": row.OrderStatus,
                    "total": 0,
                    "items": []
                }
            
            if row.ItemID:
                price = float(row.Price) if row.Price else 0
                qty = row.Quantity
                orders_dict[order_id]["total"] += price * qty
                
                orders_dict[order_id]["items"].append({
                    "name": row.ItemName,
                    "quantity": qty,
                    "price": price,
                    "image": row.ImageURL
                })

        return jsonify(list(orders_dict.values())), 200

    except Exception as e:
        print(f"❌ LỖI HISTORY: {e}")
        return jsonify([]), 200 
    finally:
        if conn: conn.close()

# ==============================================================================
# 4. API KITCHEN: Lấy danh sách đơn cần làm (Pending / Preparing) - BẾP
# ==============================================================================
@order_bp.route('/kitchen', methods=['GET'])
def get_kitchen_orders():
    conn = None
    try:
        # Lấy restaurantId từ URL
        restaurant_id = request.args.get('restaurantId')
        
        if not restaurant_id:
            return jsonify({"error": "Thiếu restaurantId"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT 
                o.OrderID, o.CreatedAt, o.OrderStatus, o.TableID,
                oi.ItemID, m.ItemName, oi.Quantity, oi.Notes
            FROM Orders o
            JOIN OrderItems oi ON o.OrderID = oi.OrderID
            JOIN MenuItems m ON oi.ItemID = m.ItemID
            WHERE o.RestaurantID = ? 
              AND o.OrderStatus IN ('Pending', 'Preparing')
            ORDER BY o.CreatedAt ASC
        """
        
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()

        orders_dict = {}
        for row in rows:
            order_id = row.OrderID
            if order_id not in orders_dict:
                orders_dict[order_id] = {
                    "id": str(order_id),
                    "orderNumber": order_id,
                    "type": 'dine-in',
                    "status": row.OrderStatus.lower(),
                    "tableNumber": row.TableID,
                    "createdAt": row.CreatedAt,
                    "items": []
                }
            
            orders_dict[order_id]["items"].append({
                "id": f"{order_id}-{row.ItemID}", 
                "dishId": str(row.ItemID),
                "dishName": row.ItemName,
                "quantity": row.Quantity,
                "notes": row.Notes
            })

        return jsonify(list(orders_dict.values())), 200
    except Exception as e:
        print(f"❌ Lỗi Kitchen: {e}")
        return jsonify([]), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 5. API MANAGER: Lấy TẤT CẢ lịch sử đơn hàng (SỬA LỖI 500)
# ==============================================================================
@order_bp.route('/restaurant/<int:restaurant_id>', methods=['GET'])
def get_all_orders_by_restaurant(restaurant_id):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 🔥 SỬA LỖI: Bỏ o.TotalAmount để tránh lỗi nếu DB thiếu cột
        query = """
            SELECT 
                o.OrderID, o.CreatedAt, o.OrderStatus, o.TableID,
                oi.ItemID, m.ItemName, oi.Quantity, oi.Notes, m.Price
            FROM Orders o
            JOIN OrderItems oi ON o.OrderID = oi.OrderID
            JOIN MenuItems m ON oi.ItemID = m.ItemID
            WHERE o.RestaurantID = ?
            ORDER BY o.CreatedAt DESC
        """
        
        cursor.execute(query, (restaurant_id,))
        rows = cursor.fetchall()

        orders_dict = {}
        for row in rows:
            # Xử lý an toàn dữ liệu row (Tuple hoặc Object)
            if isinstance(row, tuple):
                o_id, o_created, o_status, o_table = row[0], row[1], row[2], row[3]
                i_id, i_name, i_qty, i_note, i_price = row[4], row[5], row[6], row[7], row[8]
            else:
                o_id = row.OrderID
                o_created = row.CreatedAt
                o_status = row.OrderStatus
                o_table = row.TableID
                i_id = row.ItemID
                i_name = row.ItemName
                i_qty = row.Quantity
                i_note = row.Notes
                i_price = row.Price

            if o_id not in orders_dict:
                orders_dict[o_id] = {
                    "id": str(o_id),
                    "orderNumber": o_id,
                    "status": str(o_status).strip(),
                    "tableNumber": o_table,
                    "createdAt": o_created,
                    "totalAmount": 0, # Khởi tạo 0, tính cộng dồn bên dưới
                    "items": []
                }
            
            # Tính tổng tiền = giá * số lượng
            price_val = float(i_price) if i_price else 0
            orders_dict[o_id]["totalAmount"] += (price_val * i_qty)

            orders_dict[o_id]["items"].append({
                "id": f"{o_id}-{i_id}", 
                "dishName": i_name,
                "quantity": i_qty,
                "price": price_val,
                "notes": i_note
            })

        return jsonify(list(orders_dict.values())), 200
    except Exception as e:
        print("❌ LỖI API GET HISTORY (MANAGER):")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 6. API UPDATE STATUS (QUAN TRỌNG: NÚT BUMP/CANCEL)
# ==============================================================================
@order_bp.route('/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    conn = None
    try:
        data = request.json
        new_status = data.get('status') # 'completed', 'cancelled'

        if not new_status:
            return jsonify({"error": "Thiếu status"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Chuẩn hóa status (Viết hoa chữ cái đầu cho khớp DB nếu cần)
        # Ví dụ: completed -> Completed
        formatted_status = new_status.capitalize()

        query = "UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?"
        cursor.execute(query, (formatted_status, order_id))
        conn.commit()

        return jsonify({"message": f"Đã cập nhật đơn hàng thành {formatted_status}"}), 200
    except Exception as e:
        print(f"❌ Lỗi Update Status: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn: conn.close()