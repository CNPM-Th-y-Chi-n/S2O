import random

class RestaurantService:
    def __init__(self, restaurant_repository):
        self.restaurant_repository = restaurant_repository
        
        # 📸 KHO ẢNH MẪU (Dùng để fake khi DB chưa có ảnh)
        self.sample_images = [
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", # Nhà hàng sang trọng
            "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500",   # Món nướng/Steak
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500",   # Bar/Cafe
            "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500", # Cocktail/Pub
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",   # Pizza/Fastfood
            "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500",   # Mèo/Cafe
            "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500", # Không gian mở
            "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=500"  # Món Á
        ]

    # =========================================================================
    # HÀM BỔ TRỢ: Lấy giá trị an toàn từ DB
    # =========================================================================
    def _get_val(self, obj, key_list, default=None):
        if isinstance(obj, dict):
            for key in key_list:
                if key in obj: return obj[key]
            return default
        for key in key_list:
            if hasattr(obj, key):
                return getattr(obj, key)
        return default

    # =========================================================================
    # HÀM BỔ TRỢ: Chọn ảnh dựa theo ID (Để mỗi nhà hàng có ảnh riêng)
    # =========================================================================
    def _get_restaurant_image(self, r_obj, r_id):
        # 1. Ưu tiên lấy ảnh thật trong DB nếu có
        db_image = self._get_val(r_obj, ['ImageURL', 'Image', 'image'])
        if db_image and len(str(db_image)) > 10: 
            return db_image

        # 2. Nếu không có, chọn ảnh mẫu dựa trên ID
        # Logic: Dùng ID chia lấy dư cho số lượng ảnh -> Ra index
        # Ví dụ: ID=1 -> Ảnh 1, ID=2 -> Ảnh 2, ID=9 -> Quay lại Ảnh 1
        try:
            idx = int(r_id) % len(self.sample_images)
        except:
            idx = 0 # Nếu ID không phải số thì lấy ảnh đầu tiên
            
        return self.sample_images[idx]

    # =========================================================================
    # 1. API ADMIN: Lấy danh sách nhà hàng
    # =========================================================================
    def get_all_restaurants(self):
        try:
            db_restaurants = self.restaurant_repository.get_all()
            results = []
            for r in db_restaurants:
                r_id = self._get_val(r, ['RestaurantID', 'id'])
                r_name = self._get_val(r, ['Name', 'RestaurantName', 'name'], "Tên chưa cập nhật")
                
                # 👇 GỌI HÀM LẤY ẢNH RIÊNG
                r_image = self._get_restaurant_image(r, r_id)

                results.append({
                    "id": r_id,
                    "name": r_name, 
                    "image": r_image, # ✅ Ảnh đã khác nhau
                    "address": self._get_val(r, ['Address', 'address'], "Chưa có địa chỉ"),
                    "phone": self._get_val(r, ['Phone', 'phone'], ""),
                    "rating": 4.5,
                    "priceRange": "$$",
                    "owner": "Quản trị viên",
                    "status": "Active",
                    "orders": random.randint(50, 200),
                    "revenue": f"{random.randint(10, 100)}tr VNĐ"
                })
            return results
        except Exception as e:
            print(f"❌ Lỗi Service (get_all): {e}")
            return []

    # =========================================================================
    # 2. API KHÁCH HÀNG: Lấy chi tiết
    # =========================================================================
    def get_restaurant_by_id(self, restaurant_id):
        try:
            r = self.restaurant_repository.get_by_id(restaurant_id)
            if not r: return None
            
            r_id = self._get_val(r, ['RestaurantID', 'id'], restaurant_id)
            r_name = self._get_val(r, ['Name', 'RestaurantName', 'name'], "Nhà hàng")
            
            # 👇 GỌI HÀM LẤY ẢNH RIÊNG
            r_image = self._get_restaurant_image(r, r_id)

            menu_items = self.restaurant_repository.get_menu_by_restaurant(restaurant_id)
            tables = self.restaurant_repository.get_tables_by_restaurant(restaurant_id)

            return {
                "id": r_id,
                "name": r_name, 
                "address": self._get_val(r, ['Address', 'address'], "Chưa có địa chỉ"),
                "image": r_image, # ✅ Ảnh khớp với danh sách bên ngoài
                "rating": 4.5,
                "menu": [self._to_dict(item) for item in menu_items], 
                "tables": [self._to_dict(item) for item in tables]
            }
        except Exception as e:
            print(f"❌ Lỗi Service (get_by_id): {e}")
            return None

    # =========================================================================
    # CÁC HÀM KHÁC (GIỮ NGUYÊN)
    # =========================================================================
    def delete_restaurant(self, restaurant_id):
        return self.restaurant_repository.delete(restaurant_id)

    def update_restaurant(self, restaurant_id, data):
        return self.restaurant_repository.update(restaurant_id, data)
    
    def create_restaurant(self, data: dict) -> bool:
        return self.restaurant_repository.create(data)

    def get_menu_list(self, restaurant_id):
        try:
            items = self.restaurant_repository.get_menu_by_restaurant(restaurant_id)
            return [self._to_dict(item) for item in items]
        except: return []

    def _to_dict(self, obj):
        if hasattr(obj, '_mapping'): return dict(obj._mapping) 
        if hasattr(obj, 'to_dict'): return obj.to_dict()       
        if hasattr(obj, '__dict__'):                           
            d = dict(obj.__dict__)
            d.pop('_sa_instance_state', None)
            return d
        return obj