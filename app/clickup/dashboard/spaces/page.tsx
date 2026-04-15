// Spaces Page: Simple page jo sare spaces ki list dikhaati hai
// Yeh useSpaceStore se data access karta hai aur API se spaces fetch karta hai

"use client";  // Client component

import { useEffect } from 'react';  // React hook for side effects
import { useSpaceStore } from '@/lib/stores/spaceStore';  // Space store import for state management
import { Rocket  } from 'lucide-react'; 

export default function SpacesPage() {  // Main component function
  // Store se state aur actions lao
  const { spaces, loading, error, fetchSpaces } = useSpaceStore();

  // useEffect: Page load hone pe spaces fetch karo
  useEffect(() => {

    fetchSpaces();  // Store ka fetchSpaces action call karo

  }, [fetchSpaces]);  // Dependency: fetchSpaces change hone pe re-run

  // Loading state handle karo
  if (loading) return <p>Loading spaces...</p>;  // Agar loading, loading message dikhao

  // Error state handle karo
  if (error) return <p>Error: {error}</p>;  // Agar error, error message dikhao

  // Main render: Spaces list dikhao
  return (

    <div className="p-8">  {/* Simple container */}

      <div className="flex gap-8">

        {/* Left Side: All spaces joined */}
        <div className="flex-1 border-r pr-8">

          <h3 className="text-lg font-semibold mb-4">All spaces</h3>

          <hr className="mb-4" />

           <div className="flex flex-col items-center justify-center flex-1 gap-3 min-h-screen">  {/* Center both */}

           <Rocket  className="w-8 h-8 text-yellow-500" />  {/* Icon */}

           <p className="text-sm">all spaces joined</p>  {/* Text */}

          </div>

        </div>

        {/* Right Side: Visible spaces */}
        <div className="flex-1">

          <h3 className="text-lg font-semibold">Visible spaces</h3>

          <p className="text-sm text-gray-500 mb-4">spaces shown in left sidebar</p>

          <hr className="mb-4" />

          <div className="space-y-2">

            {spaces.map((space) => (

              <div key={space._id.toString()} className="flex items-center gap-3">

                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">

                  {space.name.charAt(0).toUpperCase()}

                </div>

                <span>{space.name}</span>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );
  
}

// Component ends
