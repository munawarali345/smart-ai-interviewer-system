// Task Store - Zustand for managing tasks state
// Yeh tasks ko fetch, store, aur manually set karta hai jaise userStore aur spaceStore

import { create } from 'zustand';  // Zustand se create function import for store
import { IClickUpTask } from '@/types/clickUp_Task.Type';  // Tasks ka interface import
  // Tasks fetch ka API helper import
import getUserAllTasks from '../api/getUserAllTasks';

// ============================================================================
// INTERFACES (DATA STRUCTURE FOR UI)
// ============================================================================

// 🔹 Level 1: Status level (e.g. "To Do", "In Progress")
interface TaskStatus {

  // Task ka current status (group)
  status: string;

  // Is status ke andar jitne tasks hain (FULL TASK OBJECT)
  // Note: $$ROOT use kiya tha aggregation me, isliye full IClickUpTask aa raha hai
  tasks: IClickUpTask[];
};


// Level 2: Project Box (UI ka ek card)
// Har project ek alag box hoga (ClickUp jesa UI)
interface TaskBoardItem {

  // Space info (top level grouping)
  spaceId: string;
  spaceName: string;

  // Project info (space ke andar project)
  projectId: string;
  projectName: string;

  // Is project ke andar multiple statuses honge
  // e.g. To Do, In Progress, Review, Completed
  statuses: TaskStatus[];
}

// TaskState interface: Store ki structure define karta hai
interface TaskState {

  //  IMPORTANT:
  // Ye ab flat tasks nahi hain 
  // Ye grouped structure hai (Space → Project → Status → Tasks)
  tasks: TaskBoardItem[];  // Tasks ka array, IClickUpTask type se

  loading: boolean;  // Loading state: fetch ke time true

  error: string | null;  // Error state: agar fetch fail ho

  fetchTasks: (userId: string) => Promise<void>;  // Async action: userId se 
  // tasks fetch karta hai
  setTask: (tasks: TaskBoardItem[]) => void;  // Sync action: tasks manually set karta hai

}

// Store create karta hai with initial state aur actions
export const useTaskStore = create<TaskState>((set) => ({

  // Initial state: Store ki shuruaati values
  tasks: [],  // Tasks array initially empty
  loading: false,  // Loading initially false
  error: null,  // Error initially null

  // fetchTasks action: API se tasks lao aur store me set karo
  fetchTasks: async (userId) => {

    set({ loading: true, error: null });  // Loading start karo, error clear karo

    try {

      const tasks = await getUserAllTasks(userId);  // API helper se userId ke
      //  sath tasks fetch karo
      set({ tasks, loading: false });  // Success: tasks set karo, loading band karo

    } catch (error) {

      // Error handle: error message set karo
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';

      set({ tasks: [], loading: false, error: errorMessage });  // Fail: empty tasks, loading off, error set

    }
    
  },

  // setTask action: Tasks ko manually set karo (consistency ke liye)
  setTask: (tasks) => set({ tasks }),  // State me tasks update karo

}));