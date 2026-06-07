// Sidebar Spaces Store - Zustand for managing sidebar spaces state
// Comment: Yeh store sidebar ke spaces manage karta hai, Zustand use kar ke

import { create } from 'zustand';  // Zustand ka create function import, store banane ke liye

import { ISpace } from '@/types/clickUp_Space.Type';  // ISpace type import, any ki jagah


import getSidebarSpaces from '@/lib/api/getSidebarSpaces';  // Helper import, API call ke liye

// Interface for store
// Comment: Store ki structure define karne ke liye TypeScript interface
interface SidebarSpacesState {

  spaces: ISpace[];  // Spaces array, any[] kyunki populated projects hain

  loading: boolean;  // Loading state, fetch ke time true

  error: string | null;  // Error state, agar fail ho to message

  fetchSidebarSpaces: () => Promise<void>;  // Action function, spaces fetch karta hai

  setSpaces: (spaces: ISpace[]) => void;  // Manual set action, bar bar fetch na karne ke liye

}

// Store create
// Comment: Zustand ka create use kar ke store banaya
export const useSidebarSpacesStore = create<SidebarSpacesState>((set) => ({  // Export karo, generic type add
  spaces: [],  // Initial state: empty array
  loading: false,  // Initial: loading false
  error: null,  // Initial: error null

  fetchSidebarSpaces: async () => {  // Async action define

    set({ loading: true, error: null });  // State update: loading start, error clear

    try {

      const spaces = await getSidebarSpaces();  // Helper call, spaces lao

      set({ spaces, loading: false });  // Success: spaces set, loading end

    } catch (error) {
        
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sidebar spaces';  // Error message banao

      set({ spaces: [], loading: false, error: errorMessage });  // Fail: empty spaces, loading end, error set

    }
  },

    // setSpaces: Manually spaces set karo (consistency ke liye, yaha space ko set ker dia bar bar fetch ni karna parega jub jaha spaces ki need hugi yaha se nikal lenge)
    setSpaces: (spaces) => set({ spaces }),  // State update

   }
  )
);

// Manually set ka matlab: Agar data already hai, to setSpaces(spaces) call karo, fetch nahi karo.