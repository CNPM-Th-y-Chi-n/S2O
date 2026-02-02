import { Star, ThumbsUp, Flag, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

/* ================= MOCK DATA ================= */

const reviews = [
  {
    id: 1,
    customer: "Chị Phiến",
    customerAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0t93Uo6khtOycVpju5d2chs5jWUPt6m2NQ&s",
    restaurant: "Com Tam Sai Gon",
    rating: 5,
    comment: "Theo cảm nhận của chị thì chị thấy ngon đó mấy đứa.",
    date: "Dec 26, 2024",
    status: "Published",
    helpful: 12,
  },
  {
    id: 2,
    customer: "Gojo Satoru",
    customerAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb8ocX1uyxWlO0NGGjiwM4w00ooWe9e3DMoA&s",
    restaurant: "Phở Ông Hùng",
    rating: 5,
    comment: "Pho ngon lam may em oi, Thay an 1 to la muon an them 3 to nua.",
    date: "Dec 25, 2024",
    status: "Published",
    helpful: 8,
  },
  {
    id: 3,
    customer: "Jeffrey Epstein",
    customerAvatar: "https://media-cdn-v2.laodong.vn/storage/newsportal/2026/1/31/1649200/Epstein.jpg?w=800&h=496&crop=auto&scale=both",
    restaurant: "Ốc Đêm Bình Thạnh",
    rating: 5,
    comment: "Quán rất ngon, phục vụ tốt, nhân viên thân thiện.",
    date: "Dec 25, 2024",
    status: "Published",
    helpful: 15,
  },
  {
    id: 4,
    customer: "Kim Jong-un",
    customerAvatar: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcQkIrImYIUyQhFfuDoV3YMNjB8fjn2SSzB5eXZzTJgaa0AJApI1Cna8FANnt4wbLJo2NhkSDYViFYw2c98",
    restaurant: "Bún Bò Huế Đông Ba",
    rating: 2,
    comment: "Đồ ăn không ngon lắm, phục vụ chậm.",
    date: "Dec 24, 2024",
    status: "Flagged",
    helpful: 3,
  },
  {
    id: 5,
    customer: "Vladimir Vladimirovich Putin",
    customerAvatar: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSuKVtn5rES43jkbXY24gKoppNtzdtE4MsH2JwmUgEVuQMvjy9kgakUnnrhUMI1mDczegjsNm7RBGKfMT0Pc0eICoGRMU_D5OpssO5B8IY-KAwbar5QdZG1cJ7uD7Tz8BZ0qPO3nHSH3io&s=19",
    restaurant: "Baoz Dimsum",
    rating: 5,
    comment: "Tuyet voi! Sẽ quay lai.",
    date: "Dec 24, 2024",
    status: "Published",
    helpful: 9,
  },
];

/* ================= DERIVED DATA ================= */

const totalReviews = reviews.length;
const flaggedReviews = reviews.filter(r => r.status === "Flagged").length;
const fiveStarReviews = reviews.filter(r => r.rating === 5).length;

const averageRating = (
  reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
).toFixed(1);

/* ================= COMPONENTS ================= */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

/* ================= PAGE ================= */

export function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <h3 className="text-2xl font-semibold">{averageRating}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <h3 className="text-2xl font-semibold">{totalReviews}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 fill-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">5-Star Reviews</p>
                <h3 className="text-2xl font-semibold">{fiveStarReviews}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <Flag className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Flagged Reviews</p>
                <h3 className="text-2xl font-semibold">{flaggedReviews}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews & Reports</CardTitle>
          <CardDescription>Customer feedback and review moderation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Helpful</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.customerAvatar} />
                        <AvatarFallback>{review.customer[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.customer}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.restaurant}</TableCell>
                  <TableCell>
                    <StarRating rating={review.rating} />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.comment}
                    </p>
                  </TableCell>
                  <TableCell className="text-gray-500">{review.date}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={review.status}
                      variant={review.status === "Flagged" ? "danger" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-600">
                      <ThumbsUp className="w-3 h-3" />
                      <span className="text-sm">{review.helpful}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
