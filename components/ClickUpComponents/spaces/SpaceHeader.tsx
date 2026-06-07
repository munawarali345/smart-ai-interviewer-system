"use client";  // Client component hai, hooks use ho rahe hain

import { useEffect } from 'react';  // Side effect ke liye - direct URL/refresh case handle karna
import { List } from 'lucide-react';  // List tab ka icon
import { useParams, useRouter, useSearchParams } from 'next/navigation';  // URL read/update karne ke liye
import { useSidebarSpacesStore } from '@/lib/stores/sidebarSpacesStore';  // Zustand store - spaces data

export default function SpaceHeader() {

  // =====================================================
  // URL PARAMS
  // dashboard/spaces/[projectId] → projectId nikalo
  // =====================================================
  const params = useParams();
  const projectId = params.projectId as string;  // Dynamic segment from URL

  // =====================================================
  // VIEW SWITCHING
  // router → URL change karne ke liye
  // searchParams → URL se current view read karne ke liye
  // =====================================================
  const router = useRouter();  // URL update karta hai (router.push)
  const searchParams = useSearchParams();  // URL query read karta hai (?view=list)
  const currentView = searchParams.get("view") || "list";  // URL me view nahi hai to default "list"

  // =====================================================
  // ZUSTAND STORE
  // spaces = sidebar ne fetch kiye hue spaces with projects
  // loading = fetch chal raha hai ya nahi
  // fetchSidebarSpaces = API call action
  // =====================================================
  const { spaces, loading, error, fetchSidebarSpaces } = useSidebarSpacesStore();

   // Direct URL / Refresh case - store empty ho toh fetch karo
  useEffect(() => {
    if (spaces.length === 0) {  // Store empty hai? Tab hi fetch karo
      fetchSidebarSpaces();     // API call → store bharega → component re-render hoga
    }
  }, []);  // Sirf mount par ek baar chalega

  // =====================================================
  // SPACE DHUNDNA
  // spaceId URL mein nahi hai
  // isliye projectId se parent space dhundo
  // har space ke projects check karo
  // jis space mein projectId mile → wahi parent space hai
  // =====================================================
  const currentSpace = spaces.find((s) =>
    s.projects?.some((p) => p._id === projectId)  // Koi project match karta hai?
  );

  // currentSpace mil gaya → uske projects mein se current project nikalo
  const currentProject = currentSpace?.projects?.find((p) => p._id === projectId);

  // Names nikalo, fallback empty string (loading flash avoid karne ke liye)
  const spaceName = currentSpace?.name || '';
  const projectName = currentProject?.name || '';

  // =====================================================
  // VIEW CHANGE HANDLER
  // projectId URL mein same rehta hai
  // sirf ?view=list / ?view=board query change hoti hai
  // URL change → useSearchParams dobara read → currentView update → UI update
  // =====================================================
  const changeView = (view: string) => {
    router.push(`/clickup/dashboard/spaces/${projectId}?view=${view}`);
  };

  return (

    <header className="bg-white border-b border-gray-200 p-4">  {/* Header wrapper */}

      <div className="mb-2">

        {/* =====================================================
            THREE STATES:
            1. loading → fetch chal raha hai → "Loading..." dikhao
            2. error → fetch fail hua → error message dikhao
            3. success → data aa gaya → SpaceName / ProjectName dikhao
            Ternary se sirf 2 states handle hoti, teen ke liye alag conditions
        ===================================================== */}

        {/* State 1: Loading */}
        {loading && (
          <h1 className="text-lg font-semibold text-gray-400">Loading...</h1>
        )}

        {/* State 2: Error - fetch fail hua */}
        {error && (
          <h1 className="text-lg font-semibold text-red-500">Error: {error}</h1>
        )}

        {/* State 3: Success - loading bhi nahi, error bhi nahi → naam dikhao */}
        {!loading && !error && (
          <h1 className="text-lg font-semibold">{spaceName} / {projectName}</h1>
        )}

      </div>

      {/* Bottom section: View tabs */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-6">

          {/* =====================================================
              LIST TAB
              - Click → changeView("list") → URL update
              - currentView === "list" → active styling (black + underline)
              - currentView !== "list" → inactive styling (gray)
              Future mein Board, Calendar tabs b aise hi add honge
          ===================================================== */}
          <button
            onClick={() => changeView("list")}  // Click → URL update
            className={`
              flex items-center gap-2 font-semibold cursor-pointer
              transition-all duration-200
              ${currentView === "list"
                ? "text-black border-b-2 border-black"   // Active: black + underline
                : "text-gray-500 hover:text-black"        // Inactive: gray, hover pe black
              }
            `}
          >
            <List className="w-4 h-4" />  {/* List icon */}
            List
          </button>

        </div>

      </div>

    </header>

  );
}