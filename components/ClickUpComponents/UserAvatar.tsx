// ye dashboard k header me jo user avatar he uska componet he 

import { useUserStore } from '@/lib/stores/userStore';  // Zustand store se user data access karne ke liye import
import { Avatar, AvatarFallback } from "@/components/ui/avatar";  // Shadcn UI se Avatar components import
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";  // Shadcn Dropdown for menu
import Link from "next/link";  // Next.js Link for navigation
import { ChevronDown } from 'lucide-react';  // Lucide icon for down arrow
import { Button } from "@/components/ui/button";  // Shadcn Button for trigger





export default function UserAvatar() {  // Main component function
  const { user } = useUserStore();  // Store se user object lao (name, etc.)

  if (!user) return null;  // Agar user nahi hai (null), component hide karo

  return (
  // DropdownMenu: Root component jo dropdown ka open/close state manage karta hai
  <DropdownMenu>

    {/* DropdownMenuTrigger: Ab pura area button jaisa feel dega */}
    <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">

      {/* Avatar */}
      <Avatar className="w-8 h-8">
        <AvatarFallback className="bg-blue-500 text-white text-sm">
          {user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Arrow */}
      <ChevronDown className="w-4 h-4 text-gray-500" />

    </DropdownMenuTrigger>

    {/* Dropdown Content */}
    <DropdownMenuContent className="w-64 p-0 shadow-xl border rounded-xl">

      <div className="p-4 bg-white rounded-xl">

        {/*  Top Profile Section */}
        <div className="flex items-center gap-3 mb-4">

          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-500 text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-2" />

        {/*  Menu Items */}
        <div className="flex flex-col gap-1 mt-2">

          {/* Profile */}
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-2">
            <Link href="/profile" className="w-full">
              Profile
            </Link>
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-2">
            Settings
          </DropdownMenuItem>

        </div>

      </div>
    </DropdownMenuContent>

  </DropdownMenu>
  );
}


// Summary of Each:

// DropdownMenu: Main wrapper—state aur behavior manage karta hai.

// DropdownMenuTrigger: Click event ka listener—dropdown toggle karta hai.

// DropdownMenuContent: UI content—jo dikhta hai jab open ho.

// DropdownMenuItem: Individual menu item—clickable options banata hai.

// Yeh sab Shadcn ke components hain jo Radix UI pe based hain for smooth UX. 

// Agar koi specific part aur explain chahiye, batao! Test karo aur dekho dropdown kaam kar raha hai ya nahi.