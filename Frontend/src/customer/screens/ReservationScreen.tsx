import { ArrowLeft, Calendar, Users, Check } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { useState } from "react";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface ReservationScreenProps {
  restaurant: Restaurant;
  onBack: () => void;
}

export function ReservationScreen({ restaurant, onBack }: ReservationScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guestCount, setGuestCount] = useState<string>("2");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const dates = [
    "Today, Dec 25",
    "Tomorrow, Dec 26",
    "Fri, Dec 27",
    "Sat, Dec 28",
    "Sun, Dec 29",
  ];

  const times = [
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
  ];

  const handleReserve = () => {
    if (selectedDate && selectedTime && guestCount) {
      setIsConfirmed(true);
    }
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="bg-white border-b border-border">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2>Reservation Confirmed</h2>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="mb-2">Reservation Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Your table has been reserved. We've sent a confirmation to your email.
          </p>

          <Card className="p-6 text-left space-y-4 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Restaurant</div>
              <div>{restaurant.name}</div>
            </div>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Date</div>
                <div>{selectedDate}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Time</div>
                <div>{selectedTime}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Guests</div>
              <div>{guestCount} people</div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="text-sm text-muted-foreground mb-1">Address</div>
              <div className="text-sm">{restaurant.address}</div>
            </div>
          </Card>

          <div className="space-y-3">
            <Button onClick={onBack} className="w-full">
              Back to Home
            </Button>
            <Button variant="outline" className="w-full">
              Add to Calendar
            </Button>
          </div>
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
            <h2>Reserve a Table</h2>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Restaurant Info */}
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

        {/* Select Date */}
        <div>
          <Label className="mb-3 block">Select Date</Label>
          <div className="grid grid-cols-2 gap-3">
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-4 border rounded-xl text-left transition-all ${
                  selectedDate === date
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Calendar className="w-5 h-5 mb-2" />
                <div className="text-sm">{date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Select Time */}
        <div>
          <Label className="mb-3 block">Select Time</Label>
          <div className="grid grid-cols-3 gap-2">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 border rounded-xl text-sm transition-all ${
                  selectedTime === time
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Guests */}
        <div>
          <Label htmlFor="guests" className="mb-3 block">
            Number of Guests
          </Label>
          <Select value={guestCount} onValueChange={setGuestCount}>
            <SelectTrigger id="guests" className="h-12">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <SelectValue placeholder="Select number of guests" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reserve Button */}
        <Button
          onClick={handleReserve}
          disabled={!selectedDate || !selectedTime || !guestCount}
          className="w-full h-12"
        >
          Reserve Table
        </Button>

        {/* Note */}
        <Card className="p-4 bg-muted/50 border-0">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Reservations can be cancelled up to 2 hours before the
            scheduled time. Please arrive within 15 minutes of your reservation.
          </p>
        </Card>
      </div>
    </div>
  );
}
