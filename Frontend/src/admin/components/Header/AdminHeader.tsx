import { Search, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Input } from "@/app/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";

interface HeaderProps {
  title: string;
}

export function AdminHeader({ title }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.clear();

  // reload toàn bộ app → admin layout bị unmount
  window.location.href = "/login";
};

  return (
    <header className="h-16 bg-white border-b border-gray-200 
                  flex items-center justify-between px-8
                  sticky top-0 z-50">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search restaurants, users, orders..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pinimg.com/474x/c1/79/8c/c1798c356127221e0662a0225a7c941d.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
  align="end"
  sideOffset={8}
  className="
    w-48
    z-[9999]
    bg-white
    shadow-xl
    border
  "
>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
