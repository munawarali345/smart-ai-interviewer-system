// main clickUp Dashboard page

"use client";  // Client component

import { useUserStore } from "@/lib/stores/userStore";  // user store


export default function ClickUpDashboard() {  // Component start
 
  // Store se access karo, local state remove
  const { loading, error} = useUserStore();


  if (loading) return <p>Loading...</p>;  // Loading UI
  if (error) return <p>Error: {error}</p>;  // Error display


  return (  // Main render

    <div className="min-h-screen">  {/* Outer container */}

      <div className="flex flex-1">  {/* Flex for sidebar + main, below header */}

        <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-8">  {/* Right main, padding add */}

          <h2>wellcome</h2>
         
        </main>

      </div>

    </div>

  );

}