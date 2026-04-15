// AllTasks Layout: Fixed header aur content
"use client";

import AllTaskHeader from '@/components/ClickUpComponents/All Tasks/AllTaskHeader';  // Import

// Props type define (VERY IMPORTANT in TS)
type AllTaskLayoutProps = {
  children: React.ReactNode; // dynamic content (spaces, tasks, etc)
};

export default function AllTasksLayout({ children }: AllTaskLayoutProps ) {
  return (

    <div className="min-h-screen">

      <AllTaskHeader />  {/* Header add */}

      <main className="p-8">{children}</main>

    </div>
  );
}