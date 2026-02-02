import { ArrowLeft, Star, Trash2, Edit } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  restaurantName: string;
  restaurantImage: string;
}

interface ReviewScreenProps {
  restaurant?: Restaurant;
  existingReview?: Review;
  onBack: () => void;
  onSubmit?: () => void;
}

export function ReviewScreen({
  restaurant,
  existingReview,
  onBack,
  onSubmit,
}: ReviewScreenProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0 && comment.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        onSubmit?.();
        onBack();
      }, 2000);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this review?")) {
      onBack();
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-green-600 fill-green-600" />
          </div>
          <h2 className="mb-2">Thank you for your review!</h2>
          <p className="text-muted-foreground">
            Your feedback helps others make better dining decisions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-white border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>{existingReview ? "Edit Review" : "Write a Review"}</h2>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Info */}
        {restaurant && (
          <Card className="p-4 flex items-center gap-4">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4>{restaurant.name}</h4>
              <div className="text-sm text-muted-foreground">{restaurant.cuisine}</div>
            </div>
          </Card>
        )}

        {/* Rating */}
        <div>
          <h3 className="mb-4 text-center">How was your experience?</h3>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <h3 className="mb-4">Share your thoughts</h3>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your dining experience..."
            rows={6}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground mt-2">
            {comment.length} / 500 characters
          </div>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-muted/50 border-0">
          <h4 className="mb-2">Tips for writing a great review</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Describe the food quality and taste</li>
            <li>Mention the service and atmosphere</li>
            <li>Share what you ordered</li>
            <li>Be honest and constructive</li>
          </ul>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || comment.trim().length < 10}
            className="w-full"
          >
            {existingReview ? "Update Review" : "Submit Review"}
          </Button>

          {existingReview && (
            <Button onClick={handleDelete} variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
