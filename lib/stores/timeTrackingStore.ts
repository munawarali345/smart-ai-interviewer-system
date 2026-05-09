// Time tracking store
// Yeh timer state manage karta hai, API calls karta hai
// Same pattern jaise taskStore

import { create } from 'zustand';  // Zustand create
import { persist } from 'zustand/middleware';  // persist middleware
import { startTimer as startTimerAPI } from "@/lib/api/startTimerApi"; // start timer helper
import { stopTimer as stopTimerAPI } from "@/lib/api/stopTimerApi";  // stop timer helper


// State interface
// ye define karta hai ke store me kya kya hoga
interface TimeTrackingState {
  // State properties
  isRunning: boolean;  // timer running hai ya nahi
  startTime: number | null;  // kab start hua (live calculation ke liye)
  elapsedTime: number;  // elapsed seconds kitne seconds ho gaye (UI display)
  currentTaskId: string | null;  // current task -> kaunsa task track ho raha hai
  taskElapsedTimes: Record<string, number>; // last stopped time Record ye object map huta he har task ka record huga is me k task A k track time phir task b ka task c ka task wise huga glober ek he ka ni k task A task b me b show hu Ab har task ka separate time save hoga. ye task id or seconds store krta he 


  // Actions
  startTimer: (taskId: string, userId: string) => Promise<void>;  // timer start
  stopTimer: (taskId: string, userId: string) => Promise<void>;  // timer stop
  resetTimer: () => void;  // timer reset
  updateElapsedTime: () => void;  // time update
}

// Store create with persist
export const useTimeTrackingStore = create<TimeTrackingState>()(
  persist(

    (set, get) => ({
      // Initial state
      isRunning: false,  // shuru me running nahi
      startTime: null,  // start time null
      elapsedTime: 0,  // elapsed 0
      currentTaskId: null,  // task null
      taskElapsedTimes: {}, // Ab empty object


      // Start timer action
      startTimer: async (taskId, userId) => {
        try {
          // API call pehle
          await startTimerAPI({ taskId, userId });

          // State update baad me
          set({
            isRunning: true,
            startTime: Date.now(), // timestamp number
            elapsedTime: 0,
            currentTaskId: taskId,
          });
        } catch (error) {
          console.error('Error starting timer:', error);
          throw error;  // throw for UI
        }
      },

      // Stop timer action
      stopTimer: async (taskId, userId) => {
        try {
          // API call pehle
          await stopTimerAPI({ taskId, userId });

          // State update baad me
          set({
            isRunning: false,
            startTime: null,
            elapsedTime: 0,
            currentTaskId: null,
             
            taskElapsedTimes: {       // har task ka own tracked time save hoga
             ...get().taskElapsedTimes,
              [taskId]: get().elapsedTime,
           }, 

          });
        } catch (error) {
          console.error('Error stopping timer:', error);
          throw error;  // throw for UI
        }
      },

      // Reset timer action
      resetTimer: () => {
        set({
          isRunning: false,
          startTime: null,
          elapsedTime: 0,
          currentTaskId: null,
        });
      },

      // Update elapsed time action
      updateElapsedTime: () => { // ye live timer chalata hai

        const state = get();  // current state get

        if (state.isRunning && state.startTime) { // sirf tab chale jab timer running ho
          
    // yaha ye hu raha he k abi ka time minus start time seconds me convert u rahe he 
          const elapsed = Math.floor(
              (Date.now() - state.startTime) / 1000
            );

          set({ elapsedTime: elapsed });  // update UI me live seconds update

        //   every 1 second:
        //   → calculate difference
        //   → update UI

        }

      },

    }),

    {
      name: 'time-tracking-store',  // persist name
      // Partialize if needed, but full persist
    }

  )

);