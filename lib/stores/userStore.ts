import { create } from 'zustand';  // Zustand ka create function import, jo store banata hai
import { IUser } from '@/types/clickUp_User.Type';  // IUser interface import for user type
import getUserById from '@/lib/api/getUserById';  // API function import for fetching user
import { persist } from 'zustand/middleware';  // persist middleware import


interface UserState {  // Store ki shape define karne ka interface

  user: IUser | null;  // user state: ya to IUser object ya null

  loading: boolean;  // loading state: fetch ke time true

  error: string | null;  // Add error state

//   fetch actionS
  fetchUser: (userId: string) => Promise<void>;  // async action: userId se user 
  // fetch karega
  setUser: (user: IUser | null) => void;  // sync action: user manually set karega

}

export const useUserStore = create<UserState>()(
persist(

 (set) => ({  // Store create karo, set function state update ke liye
   user: null,  // Initial user state: null (koi user nahi)

   loading: false,  // Initial loading state: false (loading nahi)

   error: null,  // Initial error null

   fetchUser: async (userId) => {  // Async action: userId le kar user fetch karega

     set({ loading: true });  // Loading start: state me loading true set karo

    try {  // Try block: agar fetch succeed ho

      const user = await getUserById(userId);  // API call: userId se user fetch karo

      set({ user, loading: false });  // Success: user set karo aur loading false

    } catch (error) {  // Catch block: agar error ho

      console.error('Error fetching user:', error);  // Error log karo

      set({ user: null, loading: false });  // Fail: user null aur loading false

    }

  },

  setUser: (user) => set({ user }),  // Sync action: user directly set karne ke liye

  }),
 {
      name: 'user-store',  // localStorage key for persist
      // On rehydrate, agar user hai to localStorage update
      onRehydrateStorage: () => (state) => {
        if (state?.user) {
          localStorage.setItem('userId', state.user._id.toString());
        }
      },
    }

));