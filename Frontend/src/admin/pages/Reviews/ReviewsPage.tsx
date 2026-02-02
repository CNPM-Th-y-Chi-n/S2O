import { Star, ThumbsUp, Flag, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { StatusBadge } from "@/admin/components";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

const reviews = [
  {
    id: 1,
    customer: "John Doe",
    customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    restaurant: "Pizza Palace",
    rating: 5,
    comment: "Absolutely amazing! The pizza was fresh and delivered hot. Will definitely order again.",
    date: "Dec 26, 2024",
    status: "Published",
    helpful: 12
  },
  {
    id: 2,
    customer: "Sarah Smith",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    restaurant: "Sushi Express",
    rating: 4,
    comment: "Great sushi quality but delivery took a bit longer than expected.",
    date: "Dec 25, 2024",
    status: "Published",
    helpful: 8
  },
  {
    id: 3,
    customer: "Mike Johnson",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    restaurant: "Burger King",
    rating: 5,
    comment: "Best burger I've had in a long time! Highly recommend the signature burger.",
    date: "Dec 25, 2024",
    status: "Published",
    helpful: 15
  },
  {
    id: 4,
    customer: "Emma Wilson",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    restaurant: "Thai Delight",
    rating: 2,
    comment: "Food was cold when it arrived and portions were small. Very disappointed.",
    date: "Dec 24, 2024",
    status: "Flagged",
    helpful: 3
  },
  {
    id: 5,
    customer: "David Lee",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    restaurant: "Cafe Mocha",
    rating: 5,
    comment: "Perfect coffee and pastries every time. My go-to morning spot!",
    date: "Dec 24, 2024",
    status: "Published",
    helpful: 9
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

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
                <h3 className="text-2xl font-semibold">4.6</h3>
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
                <h3 className="text-2xl font-semibold">2,847</h3>
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
                <h3 className="text-2xl font-semibold">1,892</h3>
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
                <h3 className="text-2xl font-semibold">23</h3>
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
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
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
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
