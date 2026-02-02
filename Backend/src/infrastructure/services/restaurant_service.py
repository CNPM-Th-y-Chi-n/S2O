#chuyển đổi dữ liệu từ object Database sang dạng từ điển (Dictionary/JSON) để Frontend đọc được.

class RestaurantService:
    def __init__(self, restaurant_repository):
        self.restaurant_repository = restaurant_repository

    def get_all_restaurants(self):
        restaurants = self.restaurant_repository.get_all()
        
        # Chuyển đổi list object thành list dictionary (JSON)
        results = []
        for r in restaurants:
            results.append({
                "id": r.Id,           # Chú ý: Tên trường phải khớp với Model của bạn
                "name": r.Name,
                "address": r.Address,
                "imageUrl": r.Image,  # Link ảnh
                "rating": r.Rating,   # Ví dụ: 4.5
                "price": r.PriceRange # Ví dụ: "$$"
            })
        return results
    def get_restaurant_by_id(self, restaurant_id):
        data = self.restaurant_repository.get_by_id(restaurant_id)
        if data:
            # Convert model object sang dictionary (nếu cần)
            return data.to_dict() if hasattr(data, 'to_dict') else data.__dict__
        return None
    def book_table(self, table_id, user_id):
        return self.repository.book_table(table_id, user_id)