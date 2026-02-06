import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, Utensils, Calendar, MessageSquare } from 'lucide-react';

interface Review {
  reviewId: number;
  restaurantId: number;
  restaurantName?: string; // Tên nhà hàng lấy từ bảng Restaurants
  rating: number;
  comment: string;
  createdAt: string;
}

const MyReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token'); // Lấy JWT Token đã lưu khi Login
        const response = await axios.get('http://192.168.1.96:5000/api/reviews/my-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(response.data.reviews);
      } catch (err) {
        setError('Không thể tải danh sách đánh giá của bạn.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Hàm hiển thị số sao
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={18}
        className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  if (loading) return <div className="text-center p-10">Đang tải đánh giá...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="text-blue-600" />
        Đánh giá của tôi
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {reviews.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed rounded-xl p-10 text-center">
          <p className="text-gray-500">Bạn chưa có đánh giá nào.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div 
              key={review.reviewId} 
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Utensils size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Nhà hàng #{review.restaurantId}
                    </h3>
                    <div className="flex gap-1 mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-400 text-sm gap-1">
                  <Calendar size={14} />
                  {review.createdAt}
                </div>
              </div>

              <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;