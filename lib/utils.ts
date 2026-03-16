// Utility function for merging Tailwind CSS classes
// Aksar React components me className merge karne ke liye use hota hai

// clsx: Conditional classes ko combine karta hai
// Example: clsx('base-class', condition && 'conditional-class')
import { clsx, type ClassValue } from "clsx"

// twMerge: Tailwind CSS classes ko properly merge karta hai
// Example: Duplicates hata deta hai - "px-2 px-4" → "px-4"
import { twMerge } from "tailwind-merge"

// Main function: clsx + twMerge combine karta hai
export function cn(...inputs: ClassValue[]) {
  // Step 1: clsx - sab inputs ko string me convert karta hai
  // Step 2: twMerge - duplicate classes hata deta hai
  return twMerge(clsx(inputs))
}

// ye duno shadCN init kerne se ae he 