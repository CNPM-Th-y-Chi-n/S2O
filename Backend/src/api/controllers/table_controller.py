from flask import Blueprint, jsonify, request
from src.infrastructure.databases import get_db_connection
import traceback

table_bp = Blueprint('table', __name__, url_prefix='/api/table')

# ==============================================================================
# 1. API GUEST: KIỂM TRA TRẠNG THÁI BÀN
# URL: GET /api/table/status?tableId=1
# ==============================================================================
@table_bp.route('/status', methods=['GET'])
def check_table_status():
    conn = None
    try:
        table_id = request.args.get('tableId')
        
        if not table_id:
            return jsonify({"error": "Thiếu tableId"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            t_id = int(table_id) 
            
            # 👇 CHÍNH XÁC: Dùng 'RestaurantTables' như trong DB của bạn
            query = "SELECT Status, TableName FROM RestaurantTables WHERE TableID = ?"
            cursor.execute(query, (t_id,))
            
            row = cursor.fetchone()
            
        except Exception as db_err:
            print("❌ LỖI SQL (Check Status):", db_err)
            return jsonify({"error": "Lỗi truy vấn Database", "details": str(db_err)}), 500

        if row:
            try:
                # Xử lý kết quả trả về
                if isinstance(row, tuple):
                    raw_status = row[0]
                    table_name = row[1]
                else:
                    raw_status = row.Status
                    table_name = row.TableName
            except Exception as parse_err:
                return jsonify({"error": "Lỗi đọc dữ liệu", "details": str(parse_err)}), 500

            clean_status = str(raw_status).strip() if raw_status else 'Available'
            
            return jsonify({
                "tableId": t_id,
                "tableName": table_name,
                "status": clean_status 
            }), 200
        else:
            return jsonify({"error": "Không tìm thấy bàn này"}), 404

    except Exception as e:
        print("❌ LỖI HỆ THỐNG:", e)
        traceback.print_exc()
        return jsonify({"error": "Lỗi Server", "details": str(e)}), 500
    finally:
        if conn: conn.close()

# ==============================================================================
# 2. API MANAGER: CẬP NHẬT TRẠNG THÁI BÀN (Làm trống / Có khách)
# URL: PUT /api/table/<id>/status
# ==============================================================================
@table_bp.route('/<int:table_id>/status', methods=['PUT'])
def update_table_status_restful(table_id):
    conn = None
    try:
        data = request.json
        new_status = data.get('status') # Frontend gửi: 'Available'

        if not new_status:
            return jsonify({"error": "Thiếu trạng thái (status)"}), 400

        print(f"🔄 Đang cập nhật bàn {table_id} sang trạng thái: {new_status}")

        conn = get_db_connection()
        cursor = conn.cursor()

        # 👇 CHÍNH XÁC: Dùng 'RestaurantTables'
        query = "UPDATE RestaurantTables SET Status = ? WHERE TableID = ?"
        cursor.execute(query, (new_status, table_id))
        
        conn.commit()

        if cursor.rowcount == 0:
             return jsonify({
                 "message": "Không có thay đổi nào (ID sai hoặc trạng thái trùng cũ)",
                 "tableId": table_id
             }), 200

        return jsonify({
            "message": "Cập nhật thành công", 
            "tableId": table_id, 
            "newStatus": new_status
        }), 200

    except Exception as e:
        print("❌ LỖI UPDATE TABLE:", e)
        traceback.print_exc()
        return jsonify({"error": "Lỗi Server", "details": str(e)}), 500
    finally:
        if conn: conn.close()