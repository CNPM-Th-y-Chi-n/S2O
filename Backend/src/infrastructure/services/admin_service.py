class AdminService:
    def __init__(self, repository):
        self.repository = repository

    def get_users(self):
        return self.repository.get_all_users()

    def delete_user(self, user_id):
        # Có thể thêm logic kiểm tra quyền ở đây (ví dụ không cho xóa chính mình)
        return self.repository.delete_user(user_id)
    def get_restaurants(self):
        return self.repository.get_all_restaurants()

    def create_restaurant(self, data):
        return self.repository.add_restaurant(data)