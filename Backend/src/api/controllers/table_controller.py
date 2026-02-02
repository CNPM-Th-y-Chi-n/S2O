from flask import Blueprint, jsonify, request
from src.infrastructure.databases import get_db_connection
import traceback

table_bp = Blueprint('table', __name__, url_prefix='/api/table')

@table_bp.route('/status', methods=['GET'])
def check_table_status():
    try:
        table_id = request.args.get('tableId')
        
        # 1. Kiểm tra tham số
        if not table_id:
            return jsonify({"error": "Thiếu tableId"}), 400

        # 2. Kết nối Database
        conn = get_db_connection()
        cursor = conn.cursor()

        # 3. Thực thi SQL (Dùng try-except riêng cho SQL để bắt lỗi cú pháp)
        try:
            # Chuyển ID sang số nguyên an toàn
            t_id = int(table_id) 
            
            # --- CÂU LỆNH SQL ---
            # Đảm bảo tên bảng 'RestaurantTables' và cột 'TableID' đúng trong DB của bạn
            query = "SELECT Status, TableName FROM RestaurantTables WHERE TableID = ?"
            cursor.execute(query, (t_id,))
            
            # Lấy dòng đầu tiên
            row = cursor.fetchone()
            
        except Exception as db_err:
            print("❌ LỖI SQL:", db_err)
            return jsonify({
                "error": "Lỗi truy vấn Database", 
                "details": str(db_err),
                "sql_query": "SELECT Status, TableName FROM RestaurantTables WHERE TableID = ?"
            }), 500

        # 4. Xử lý kết quả trả về
        if row:
            # Xử lý trường hợp row trả về là Tuple hay Object
            try:
                # Nếu row là tuple (thường gặp): row[0] là Status
                if isinstance(row, tuple):
                    raw_status = row[0]
                    table_name = row[1]
                # Nếu row là object (pyodbc row): truy cập theo tên cột
                else:
                    raw_status = row.Status
                    table_name = row.TableName
            except Exception as parse_err:
                # Nếu lỗi truy cập cột, trả về lỗi chi tiết
                return jsonify({
                    "error": "Lỗi đọc dữ liệu từ dòng (Row)", 
                    "details": str(parse_err),
                    "row_data": str(row)
                }), 500

            # Xử lý chuỗi (xóa khoảng trắng)
            clean_status = str(raw_status).strip() if raw_status else 'Available'
            
            return jsonify({
                "tableId": t_id,
                "tableName": table_name,
                "status": clean_status 
            }), 200
        else:
            return jsonify({"error": "Không tìm thấy bàn này trong Database"}), 404

    except Exception as e:
        # Bắt tất cả các lỗi khác (Code Python bị sai)
        print("❌ LỖI HỆ THỐNG:", e)
        traceback.print_exc()
        return jsonify({
            "error": "Lỗi Server (Python Crash)", 
            "details": str(e)
        }), 500
        
    finally:
        # Luôn đóng kết nối
        if 'conn' in locals() and conn:
            conn.close()

# API Update (Giữ nguyên)
@table_bp.route('/update-status', methods=['POST'])
def update_table_status():
    try:
        data = request.json
        table_id = data.get('tableId')
        new_status = data.get('status') 
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE RestaurantTables SET Status = ? WHERE TableID = ?", (new_status, table_id))
        conn.commit()
        return jsonify({"message": "OK"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if 'conn' in locals() and conn: conn.close()