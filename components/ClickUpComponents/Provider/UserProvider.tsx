// ye userprovider he kun ki header me hame user ki need he to wo header humn elayout me rakha he dashbord k to usko pehle user chaiye he to yaha ker re he take age mil jai

"use client";  // Yeh directive Next.js ko batata hai ke yeh Client Component hai—hooks use karne ke liye zaroori
import { useEffect } from 'react';  // React hook import for side effects (e.g., data fetch)
import { useUserStore } from '@/lib/stores/userStore';  // Zustand store import for user management
import { useSearchParams } from "next/navigation";  // Next.js hook for URL search params

export default function UserProvider({ children }: { children: React.ReactNode }) {  // Component function, children prop leta hai (wrapped components)
  const searchParams = useSearchParams();  // Hook: Current URL ke search params lao
  const userId = searchParams.get('userId');  // userId extract karo URL se (e.g., ?userId=123)
  const { fetchUser } = useUserStore();  // Store se fetchUser action lao

  useEffect(() => {  // Hook: Component mount hone pe run hota hai
    if (userId)  // Agar userId URL me hai
      fetchUser(userId);  // Store me user fetch karo aur set karo
  }, [fetchUser]);  // Dependency: fetchUser change hone pe re-run (rare)

  return <>{children}</>;  // Wrapped components (children) return karo
}