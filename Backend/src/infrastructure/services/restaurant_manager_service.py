from werkzeug.security import generate_password_hash

class RestaurantManagerService:
    def __init__(self, repository):
        self.repository = repository

    # --- CÁC HÀM CŨ (Giữ nguyên) ---
    def get_tables(self, restaurant_id):
        return self.repository.get_tables_raw(restaurant_id)

    def get_restaurant_info(self, restaurant_id):
        return self.repository.get_restaurant_basic_info(restaurant_id)

    def create_restaurant(self, data):
        return self.repository.add_restaurant(data)

    
    def get_staff_list(self):
        # Kết nối Controller xuống Repository để lấy danh sách
        return self.repository.get_all_staff()

    def create_staff(self, data):
        # 1. Mã hóa mật khẩu (Quan trọng)
        raw_password = data.get('password')
        if not raw_password:
            return None
        
        # Hash password trước khi lưu vào DB
        hashed_password = generate_password_hash(raw_password)
        
        # 2. Gán password đã mã hóa vào data
        data['passwordHash'] = hashed_password
        
        # 3. Gọi Repository để lưu
        return self.repository.add_staff_user(data)