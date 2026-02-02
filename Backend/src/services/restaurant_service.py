# File: src/services/restaurant_service.py

class RestaurantService:
    def __init__(self, restaurant_repository):
        self.restaurant_repository = restaurant_repository

    # 1. Hàm lấy danh sách (Giữ nguyên)
    def get_all_restaurants(self):
        db_restaurants = self.restaurant_repository.get_all()
        results = []
        for r in db_restaurants:
            if hasattr(r, 'to_dict'):
                results.append(r.to_dict())
            else:
                results.append({
                    "id": r.id,
                    "name": r.name,
                    "image": getattr(r, 'image', "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"),
                    "rating": getattr(r, 'rating', 4.5),
                    "address": getattr(r, 'address', "Unknown Address"),
                    "priceRange": getattr(r, 'price_range', "$$")
                })
        return results

    # 2. 👇 HÀM QUAN TRỌNG ĐÃ ĐƯỢC CẬP NHẬT 👇
    def get_restaurant_by_id(self, restaurant_id):
        # Bước 1: Lấy thông tin nhà hàng cơ bản
        r = self.restaurant_repository.get_by_id(restaurant_id)
        
        if not r:
            return None
            
        # Bước 2: Convert sang Dictionary
        data = {}
        if hasattr(r, 'to_dict'):
            data = r.to_dict()
        else:
            # Fallback nếu to_dict lỗi
            data = {
                "id": r.id,
                "name": r.name,
                "address": getattr(r, 'address', "Unknown"),
                "image": getattr(r, 'image', ""),
                "rating": getattr(r, 'rating', 4.5)
            }

        # ---------------------------------------------------------
        # 👇 KẾT NỐI VỚI REPOSITORY ĐỂ LẤY MENU & BÀN THẬT 👇
        # ---------------------------------------------------------
        
        print(f"Service: Đang gọi Repo lấy Menu cho ID {restaurant_id}...")
        # Gọi hàm lấy Menu từ Repository
        menu_items = self.restaurant_repository.get_menu_by_restaurant(restaurant_id)
        
        print(f"Service: Đang gọi Repo lấy Bàn cho ID {restaurant_id}...")
        # Gọi hàm lấy Bàn từ Repository
        tables = self.restaurant_repository.get_tables_by_restaurant(restaurant_id)

        # Bước 3: Gán dữ liệu vào kết quả trả về
        # Lưu ý: Phải dùng .to_dict() để convert từng object trong list
        data['menu'] = [item.to_dict() for item in menu_items]
        data['tables'] = [table.to_dict() for table in tables]

        return data
    def delete_restaurant(self, restaurant_id):
        return self.restaurant_repository.delete(restaurant_id)
    def update_restaurant(self, restaurant_id, data):
        return self.restaurant_repository.update(restaurant_id, data)
    
    def create_restaurant(self, data: dict) -> bool:
        return self.restaurant_repository.create(data)
