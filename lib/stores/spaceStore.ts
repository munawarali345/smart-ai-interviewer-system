// Space Store - Zustand for managing spaces state
// Yeh spaces ko fetch, store, aur manage karta hai jaise userStore

import { create } from 'zustand';  // Zustand se create import, store banane ke liye
import { ISpace } from '@/types/clickUp_Space.Type';  // ISpace interface import for type safety
import getSpaces from '@/lib/api/getSpaces';  // getSpaces helper import for API call

interface SpaceState {  // Store ki structure define
  spaces: ISpace[];  // Spaces ka array, har space ISpace type ka
  loading: boolean;  // Fetch ke time loading dikhaane ke liye
  error: string | null;  // Agar error ho to message store karne ke liye
  fetchSpaces: () => Promise<void>;  // Function jo spaces fetch karega
   setSpaces: (spaces: ISpace[]) => void;  // sync action: spaces manually set karega
}

export const useSpaceStore = create<SpaceState>((set) => ({  // Store export, create function se banao
  spaces: [],  // Initial: koi space nahi
  loading: false,  // Initial: loading nahi
  error: null,  // Initial: koi error nahi

  fetchSpaces: async () => {  // Async action: spaces lao

    set({ loading: true, error: null });  // State update: loading on, error clear

    try {  // Try: API call

      const spaces = await getSpaces();  // Helper se spaces fetch

      set({ spaces, loading: false });  // Success: spaces set, loading off

    } catch (error) {  // Catch: error handle

     set({ spaces: [], loading: false, error: error instanceof Error ? error.message : 'Failed to fetch spaces' });  // Fail: empty spaces, loading off, error set

    }

  },

  // setSpaces: Manually spaces set karo (consistency ke liye, yaha space ko set ker dia bar bar fetch ni karna parega jub jaha spaces ki need hugi yaha se nikal lenge)
  setSpaces: (spaces) => set({ spaces }),  // State update
  
}));

// Manually set ka matlab: Agar data already hai, to setSpaces(spaces) call karo, fetch nahi karo.