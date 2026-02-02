import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { RestaurantCard, Restaurant } from "../components/RestaurantCard";
import { SearchBar } from "../components/SearchBar";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";

interface RestaurantListScreenProps {
  restaurants: Restaurant[];
  onRestaurantClick: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export function RestaurantListScreen({
  restaurants,
  onRestaurantClick,
  onBack,
}: RestaurantListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const cuisineOptions = ["Italian", "Japanese", "Mexican", "American", "Chinese"];
  const priceRangeOptions = ["$", "$$", "$$$"];

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const togglePriceRange = (range: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisines.length === 0 || selectedCuisines.includes(restaurant.cuisine);
    const matchesPrice =
      selectedPriceRanges.length === 0 || selectedPriceRanges.includes(restaurant.priceRange);
    return matchesSearch && matchesCuisine && matchesPrice;
  });

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="flex-1">All Restaurants</h2>
            <Sheet>
              <SheetTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full">
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filters & Sort</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Sort By */}
                  <div>
                    <Label className="mb-3 block">Sort By</Label>
                    <RadioGroup value={sortBy} onValueChange={setSortBy}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rating" id="rating" />
                        <Label htmlFor="rating">Rating</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distance" id="distance" />
                        <Label htmlFor="distance">Distance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reviews" id="reviews" />
                        <Label htmlFor="reviews">Reviews</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Cuisine Filter */}
                  <div>
                    <Label className="mb-3 block">Cuisine</Label>
                    <div className="space-y-2">
                      {cuisineOptions.map((cuisine) => (
                        <div key={cuisine} className="flex items-center space-x-2">
                          <Checkbox
                            id={cuisine}
                            checked={selectedCuisines.includes(cuisine)}
                            onCheckedChange={() => toggleCuisine(cuisine)}
                          />
                          <Label htmlFor={cuisine}>{cuisine}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <Label className="mb-3 block">Price Range</Label>
                    <div className="space-y-2">
                      {priceRangeOptions.map((range) => (
                        <div key={range} className="flex items-center space-x-2">
                          <Checkbox
                            id={range}
                            checked={selectedPriceRanges.includes(range)}
                            onCheckedChange={() => togglePriceRange(range)}
                          />
                          <Label htmlFor={range}>{range}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCuisines([]);
                      setSelectedPriceRanges([]);
                      setSortBy("rating");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {/* Restaurant List */}
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="text-sm text-muted-foreground mb-4">
          {sortedRestaurants.length} restaurants found
        </div>
        <div className="space-y-4">
          {sortedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => onRestaurantClick(restaurant)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
