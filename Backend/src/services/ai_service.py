import random

class AIService:
    def __init__(self, repository):
        self.repository = repository

    def process_chat(self, user_id, message, restaurant_id=None):
        response_text = ""
        lower_msg = message.lower()
        
        # --- 1. CÂU HỎI: "Món nào phù hợp cho bữa trưa?" ---
        if "bữa trưa" in lower_msg or "ăn trưa" in lower_msg:
            # Logic: Lấy ngẫu nhiên 1 quán để gợi ý
            suggestion = self.repository.get_random_recommendation()
            if suggestion:
                response_text = (
                    f"🥗 **Gợi ý bữa trưa tuyệt vời:**\n"
                    f"Bạn hãy thử ghé **{suggestion.Name}** xem sao!\n"
                    f"⭐ Đánh giá: {suggestion.Rating}/5.0\n"
                    f"📍 Địa chỉ: {suggestion.Address}\n"
                    f"📝 {suggestion.Description}\n\n"
                    f"Bạn có muốn mình đặt bàn lúc 12:00 không?"
                )
            else:
                response_text = "Hiện tại mình chưa tìm thấy quán nào phù hợp. Bạn thử tìm món cụ thể như 'Cơm' hoặc 'Phở' xem?"

        # --- 2. CÂU HỎI: "Tôi muốn ăn Phở." (Xử lý thông minh) ---
        elif "phở" in lower_msg or "pho" in lower_msg:
            print("🚀 [AI] Đang tìm món Phở...")
            
            # Bước 1: Tìm chính xác từ "Phở"
            restaurants = self.repository.search_restaurants("Phở")
            
            # Bước 2: Nếu không thấy, tìm từ "Pho" (không dấu) đề phòng DB lưu sai
            if not restaurants:
                 print("⚠️ Không thấy 'Phở', đang thử tìm 'Pho'...")
                 restaurants = self.repository.search_restaurants("Pho")

            if restaurants:
                response_text = f"🍜 Tìm thấy {len(restaurants)} quán **Phở** ngon cho bạn:\n\n"
                for r in restaurants:
                    response_text += f"- 🏪 **{r.Name}** ({r.Rating}⭐)\n   📍 {r.Address}\n\n"
                response_text += "Bạn thích quán nào nhất?"
            else:
                response_text = "Tiếc quá, hệ thống chưa tìm thấy quán Phở nào. Bạn thử tìm 'Bún' hoặc 'Hủ tiếu' xem?"

        # --- 3. CÂU HỎI: "Cho tôi xem quán ăn được đánh giá cao nhất!" ---
        elif "đánh giá cao" in lower_msg or "nổi tiếng" in lower_msg or "best" in lower_msg:
            # Gọi hàm search không tham số (Repo sẽ tự order by Rating DESC)
            top_restaurants = self.repository.search_restaurants()
            
            response_text = "🏆 **Top 5 Nhà hàng xuất sắc nhất hệ thống:**\n\n"
            for i, r in enumerate(top_restaurants, 1):
                icon = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else "🎗️"
                response_text += f"{icon} **{r.Name}** ({r.Rating}⭐)\n   📍 {r.Address}\n\n"
            
            response_text += "Bạn muốn thử quán Top 1 không?"

        # --- 4. CÂU HỎI: "Quán nào gần tôi nhất?" ---
        elif "gần tôi" in lower_msg or "gần đây" in lower_msg or "vị trí" in lower_msg:
            restaurants = self.repository.search_restaurants() 
            
            response_text = (
                "📍 Hiện tại mình chưa định vị được GPS của bạn, nhưng đây là các quán nổi bật ở trung tâm thành phố:\n\n"
            )
            for r in restaurants[:3]: # Lấy 3 quán đầu
                response_text += f"🏢 **{r.Name}**\n   -> Địa chỉ: {r.Address}\n\n"
            
            response_text += "Quán nào tiện đường cho bạn nhất?"

        # --- CÁC TRƯỜNG HỢP KHÁC (Chat tự do) ---
        
        # Chào hỏi
        elif any(w in lower_msg for w in ["hello", "hi", "xin chào", "chào"]):
            suggestion = self.repository.get_random_recommendation()
            if suggestion:
                response_text = f"Xin chào! Hôm nay trời đẹp, bạn có muốn thử **{suggestion.Name}** ({suggestion.Rating}⭐) không?"
            else:
                response_text = "Chào bạn! Bạn đang đói bụng phải không? Hãy chọn món bạn thích nhé! 😋"

        # Tìm kiếm món ăn chung (Pizza, Sushi, Cơm...)
        else:
            food_keywords = ["pizza", "sushi", "burger", "lẩu", "nướng", "cơm", "bún", "mì", "trà sữa"]
            found_keyword = next((w for w in food_keywords if w in lower_msg), None)
            
            if found_keyword:
                # Tìm kiếm thông minh: Tìm cả có dấu và không dấu
                search_terms = [found_keyword]
                # Map thêm từ không dấu cho các từ phổ biến
                if found_keyword == "bún": search_terms.append("bun")
                if found_keyword == "lẩu": search_terms.append("lau")
                if found_keyword == "cơm": search_terms.append("com")
                if found_keyword == "mì": search_terms.append("mi")

                restaurants = []
                for term in search_terms:
                    res = self.repository.search_restaurants(term)
                    restaurants.extend(res)
                
                # Loại bỏ trùng lặp (theo ID)
                seen_ids = set()
                unique_restaurants = []
                for r in restaurants:
                    if r.RestaurantID not in seen_ids:
                        unique_restaurants.append(r)
                        seen_ids.add(r.RestaurantID)

                if unique_restaurants:
                    response_text = f"🔎 Kết quả tìm kiếm cho **'{found_keyword}'**:\n\n"
                    for r in unique_restaurants[:5]:
                        response_text += f"🍽️ **{r.Name}** ({r.Rating}⭐)\n   📍 {r.Address}\n\n"
                else:
                    response_text = f"Không tìm thấy quán nào bán '{found_keyword}'. Bạn thử món khác xem?"
            else:
                # Không hiểu ý định
                response_text = "Mình chưa hiểu rõ lắm. Bạn hãy thử bấm vào các câu hỏi gợi ý bên dưới hoặc nhập tên món ăn (ví dụ: 'Pizza', 'Phở') nhé! 👇"

        # --- Lưu log vào DB ---
        if self.repository:
            self.repository.save_chat_log(user_id, message, response_text, restaurant_id)
        
        return response_text