// AllTaskHeader Component: Header for All Tasks page
// Yeh user ka workspace name aur List tab dikhaata hai

"use client";  // Client component for hooks

import { useUserStore } from '@/lib/stores/userStore';  // User store import
import { List } from 'lucide-react';  // List icon import

export default function AllTaskHeader() {  // Main component

  const { user } = useUserStore();  // User data lao

  return (

    <header className="bg-white border-b border-gray-200 p-4">  {/* Header container */}

      <div className="mb-2">  {/* Top section */}
        
        <h1 className="text-lg font-semibold">{user?.name || 'User'} Workspace</h1>  {/* Workspace name */}

      </div>

      <div className="flex items-center justify-between">  {/* Bottom section */}

        <div className="flex items-center gap-6">  {/* Left: Tabs */}

          <button className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold">  {/* List button */}

            <List className="w-4 h-4" />  {/* Lucide List icon */}
            List  {/* Tab text */}

          </button>

        </div>

        <button className="bg-blue-500 text-white px-3 py-1 rounded">
            + View
        </button>  {/* Right: Add view */}

      </div>

    </header>

  );
  
}

// Component ends