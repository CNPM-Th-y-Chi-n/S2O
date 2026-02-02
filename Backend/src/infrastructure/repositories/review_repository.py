# src/infrastructure/repositories/review_repository.py
class ReviewRepository:
    def __init__(self, session):
        self.session = session

    def get_by_user_id(self, user_id: int):
        try:
            # Truy vấn tất cả review của User đó, sắp xếp mới nhất lên đầu
            return self.session.query(RestaurantReviewModel)\
                .filter_by(user_id=user_id)\
                .order_by(RestaurantReviewModel.created_at.desc())\
                .all()
        except Exception as e:
            print(f"❌ [REPO ERROR] Get Reviews Failed: {e}")
            return []