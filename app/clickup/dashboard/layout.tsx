// Dashboard Layout: Shared header aur sidebar for all dashboard pages
// Layout = ek wrapper jo common UI (Header + Sidebar) ko fix rakhta hai
// Sirf right side content change hota hai

import ClickUpHeader from '@/components/ClickUpComponents/ClickUpHeader';
import ClickUpSideBar from '@/components/ClickUpComponents/ClickUpSideBar';
import UserProvider from '@/components/ClickUpComponents/Provider/UserProvider';  // Import


// Props type define (VERY IMPORTANT in TS)
type DashboardLayoutProps = {
  children: React.ReactNode; // dynamic content (spaces, tasks, etc)
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
<UserProvider>

   <div className="min-h-screen">  {/* Outer container */}

      <ClickUpHeader />  {/* Header full width top pe */}

      <div className="flex flex-1">  {/* Flex for sidebar + main, below header */}

        <ClickUpSideBar />  {/* Left sidebar */}

        <main className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 p-8">  {/* Right main, padding add */}
            
             {children}  {/* Dynamic content add */}
         
        </main>

      </div>

    </div>

    </UserProvider>

  );
}