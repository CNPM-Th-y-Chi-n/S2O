from src.infrastructure.models.s2o_structures import OrderModel, OrderItemModel
from sqlalchemy.orm import joinedload

class OrderRepository:
    def __init__(self, session):
        self.session = session

    def get_orders_by_user(self, user_id):
        try:
            # Query lọc theo user_id
            orders = self.session.query(OrderModel)\
                .options(
                    joinedload(OrderModel.restaurant),
                    joinedload(OrderModel.items).joinedload(OrderItemModel.menu_item)
                )\
                .filter(OrderModel.user_id == user_id)\
                .order_by(OrderModel.created_at.desc())\
                .all()
            return orders
        except Exception as e:
            print(f"❌ Lỗi SQL OrderRepository: {e}")
            return []
    
    
    def get_all_orders(self):
        try:
            # Query này sẽ lấy: Order + Thông tin Nhà hàng + Các món trong Order + Thông tin chi tiết từng món (Tên, Giá)
            # joinedload giúp lấy hết dữ liệu trong 1 lần truy vấn (Tối ưu hóa)
            orders = self.session.query(OrderModel)\
                .options(
                    joinedload(OrderModel.restaurant),
                    joinedload(OrderModel.items).joinedload(OrderItemModel.menu_item)
                )\
                .order_by(OrderModel.created_at.desc())\
                .all()
            return orders
        except Exception as e:
            print(f"Lỗi SQL OrderRepository: {e}")
            return []