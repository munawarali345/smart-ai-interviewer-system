// ye clickup ka dashboard ka header he 

"use client"; // clint component

// ClickUp Header Component - Workspace name aur actions show karta hai
import Link from "next/link";  // Navigation link import
import { useUserStore } from "@/lib/stores/userStore";  // Store import
import UserAvatar from "./UserAvatar";  // New component import




export default function ClickUpHeader() {  // Props se user le
    const { user } = useUserStore();  // Store se user access

  return (

    <header className="bg-white border-b border-slate-200 shadow-sm">  {/* Header styling */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">   {/* Container */}

        {/* Left: Workspace Name - User ka name show */}

        <h1 className="text-xl font-semibold text-slate-900">

          {user ? `${user.name}'s Workspace` : "ClickUp Workspace"}  {/* Store se user */} 
          
        </h1>

        {/* Right: Create User Button */}
        <div className="flex items-center gap-4">  {/*  Right side container */}

           <UserAvatar />  {/* Add yahan: User profile show hoga */}

          <Link  // Create user page link

            href="/clickup/createUser"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create User

          </Link>

        </div>

      </div>

    </header>

  );

}