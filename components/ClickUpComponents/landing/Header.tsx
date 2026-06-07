// ================================
// Transparent Header Component
// ================================
// Purpose: Navbar with logo, login, and create user buttons
// Responsive design with scroll-based background effect

'use client'; // Client component for hooks

import React, { useState, useEffect } from 'react'; // React hooks for scroll state management
import { Bot } from 'lucide-react'; // Bot icon for logo
import { Button } from '@/components/ui/button'; // Shadcn Button component
import { cn } from '@/lib/utils'; // Utility for class merging

// ================================
// Header Component
// ================================
export default function Header() {
  // State for navbar background on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Agar scroll 50px se zyada ho to background add karo
      setIsScrolled(window.scrollY > 50);
    };

    // Scroll event listener add karo
    window.addEventListener('scroll', handleScroll);
    // Cleanup: component unmount hone par listener remove karo
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // Professional navbar with clean design
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-lg border-b border-gray-200',
        isScrolled ? 'shadow-lg' : ''
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {/* Logo Icon with clean design */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl shadow-sm">
              <Bot className="h-6 w-6 text-white" />
            </div>
            {/* Logo Text */}
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              ClickUp
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-6">
            {/* Login Button */}
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              Login
            </Button>

            {/* Sign Up Button */}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}