// AllTaskHeader Component: Header for All Tasks page
// Yeh user ka workspace name aur List tab dikhaata hai

"use client";  // Client component for hooks

import { useUserStore } from '@/lib/stores/userStore';  // User store import
import { List } from 'lucide-react';  // List icon import
import { useRouter, useSearchParams } from 'next/navigation';

// Purpose: URL based view switching (list, board etc)
export default function AllTaskHeader() {  // Main component

  const { user } = useUserStore();  // User data lao

  // ============================
  // NEXT.JS ROUTER (URL control)
  // ============================
  const router = useRouter();

   // =====================================================
  // CURRENT URL QUERY READ KARNA
  // Example: /all-tasks?view=list
  // =====================================================
  const searchParams = useSearchParams();

  // currentView = "list" | "board" | etc
  const currentView = searchParams.get("view") || "list";


   // =====================================================
  // VIEW CHANGE HANDLER
  // Ye function URL update karta hai (state ki jagah)
  // =====================================================
  const changeView = (view: string) => {

    // URL update → Next.js re-render trigger karega
     router.push(`/clickup/dashboard/AllTasks?view=${view}`);  // router.push page reload ni karega bus url cahnge state change ni hua url chnage huga 
  };

  return (

    <header className="bg-white border-b border-gray-200 p-4">  {/* Header container */}

      <div className="mb-2">  {/* Top section */}
        
        <h1 className="text-lg font-semibold">{user?.name || 'User'} Workspace</h1>  {/* Workspace name */}

      </div>

      {/* =====================================================
          BOTTOM SECTION: TABS + ACTION BUTTON
      ===================================================== */}

      <div className="flex items-center justify-between">  {/* Bottom section */}

        {/* =====================================================
            LEFT SIDE: VIEW TABS
        ===================================================== */}
        <div className="flex items-center gap-6">  {/* Left: Tabs */}

          {/* =====================================================
              LIST VIEW BUTTON
              - Click → URL change
              - Active → underline + black color
          ===================================================== */}
           <button
            onClick={() => changeView("list")}
            className={`
              flex items-center gap-2 font-semibold cursor-pointer
              transition-all duration-200

              ${currentView === "list"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
               }
             `}
            >  {/* List button */}

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



/*
=====================================================
STEP 1 FLOW EXPLANATION (CLICKUP STYLE SYSTEM)
=====================================================

1. User clicks "List" button
   → onClick triggers changeView("list")

2. changeView function runs
   → router.push("/clickup/dashboard/AllTasks?view=list")

3. URL updates in browser
   → /clickup/dashboard/AllTasks?view=list

4. Next.js detects route change
   → component re-renders

5. useSearchParams reads URL
   → view=list extracted

6. currentView becomes "list"

7. UI updates based on currentView
   → Active styling applied

=====================================================
WHY WE USE THIS APPROACH?

✔ URL = single source of truth
✔ Refresh safe
✔ Shareable links
✔ Back/forward browser support
✔ Scalable for SaaS apps 

=====================================================
User clicks List
        ↓
changeView("list")
        ↓
router.push("/clickup/dashboard/AllTasks?view=list")
        ↓
URL updates
        ↓
Next.js re-renders same page
        ↓
useSearchParams reads "view=list"
        ↓
currentView = "list"
        ↓
UI updates (active tab)
*/

/*
 User clicks "List / Board" button

Step 1:
Header button click hota hai
→ onClick changeView("list" | "board")

Step 2:
Router URL update karta hai
→ router.push("/clickup/dashboard/AllTasks?view=list")

Step 3:
Next.js re-render hota hai (SPA behavior)
→ page reload nahi hota

Step 4:
URL se new view read hota hai
→ useSearchParams()
→ view update hota hai

Step 5:
Header active state update hota hai
→ currentView === view

Step 6:
Page UI switch hota hai
→ list → Tasks
*/