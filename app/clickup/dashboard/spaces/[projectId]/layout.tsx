// AllTasks Layout: Fixed header aur content
"use client";

import SpaceHeader from "@/components/ClickUpComponents/spaces/SpaceHeader";  // Import

// Props type define (VERY IMPORTANT in TS)
type AllTaskLayoutProps = {
  children: React.ReactNode; // dynamic content (spaces, tasks, etc)
};

export default function SpaceHeaderLayout({ children }: AllTaskLayoutProps ) {
  return (

    <div className="min-h-screen">

      <SpaceHeader />  {/* Header add */}

      <main className="p-8">{children}</main>

    </div>
  );
}