// Task Store - Zustand for managing tasks state
// Yeh tasks ko fetch, store, aur manually set karta hai jaise userStore aur spaceStore

import { create } from 'zustand';  // Zustand se create function import for store
import { IClickUpTask } from '@/types/clickUp_Task.Type';  // Tasks ka interface import
  // Tasks fetch ka API helper import
import getUserAllTasks from '../api/getUserAllTasks';
import { changeTaskStatus } from '../api/taskStatusChange';

// ============================================================================
// INTERFACES (DATA STRUCTURE FOR UI)
// ============================================================================

//  Level 1: Status level (e.g. "To Do", "In Progress")
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

   // tasks fetch karta hai
  fetchTasks: (userId: string, spaceId?: string, projectId?: string) => Promise<void>;  // Async action: userId se 
 
  // status update k liye 
  updateTaskStatus: (taskId: string, newStatus: string, userId: string) => Promise<void>;

  setTask: (tasks: TaskBoardItem[]) => void;  // Sync action: tasks manually set karta hai

}

// Store create karta hai with initial state aur actions
export const useTaskStore = create<TaskState>((set) => ({

  // Initial state: Store ki shuruaati values
  tasks: [],  // Tasks array initially empty
  loading: false,  // Loading initially false
  error: null,  // Error initially null

  // fetchTasks action: API se tasks lao aur store me set karo
  fetchTasks: async ( userId, spaceId, projectId) => {

    set({ loading: true, error: null });  // Loading start karo, error clear karo

    try {

      const tasks = await getUserAllTasks(userId, spaceId, projectId);  // API helper se userId ke
      //  sath tasks fetch karo
      set({ tasks, loading: false });  // Success: tasks set karo, loading band karo

    } catch (error) {

      // Error handle: error message set karo
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';

      set({ tasks: [], loading: false, error: errorMessage });  // Fail: empty tasks, loading off, error set

    }
    
  },

  // yaha hum task update or task ko move karwa raha he ek status se doosre me 
  // Function start: async function, params: taskId (string), newStatus (string), userId (string)
  // Ye params UI se aate hain (TaskDetailsPanel se onChange par)
  updateTaskStatus: async (taskId, newStatus, userId) => {

   set({ loading: true, error: null });  // Loading start karo, error clear karo

  try {
    
    // Step 1: API call karo changeTaskStatus se
    const UpdatedStatus = await changeTaskStatus({ taskId, newStatus, userId });
    
    // Local state update: task ko old status se remove, new mein add
    set((prevState) => {
      // prevState: Current store state (tasks array, grouped by space/project/status)
      // set function ko prevState milta hai access karne ke liye

      // Step 3: New tasks array banao by mapping over prevState.tasks
      const newTasks = prevState.tasks.map(board => ({
        // Har board (space/project) ko traverse karo
        // board: { spaceId, spaceName, projectId, projectName, statuses: [...] }

        ...board,  // Board ka baaki data copy karo

         statuses: board.statuses.map(statusGroup => ({
          // Har statusGroup ko traverse karo (e.g., "to do", "in progress")
          // statusGroup: { status: string, tasks: IClickUpTask[] }

          ...statusGroup,  // StatusGroup ka baaki data copy karo

            tasks: statusGroup.tasks.filter(t => t._id.toString() !== taskId)
          // Task ko old status group se remove karo
          // filter: Sirf wo tasks rakho jinka _id taskId se match nahi karta
          // Result: Old group mein se ye task nikal gaya

        })).map(statusGroup =>   // Ab second map: New status group mein add karo
             
          statusGroup.status === newStatus 

            ? { ...statusGroup, tasks: [...statusGroup.tasks, UpdatedStatus.task] }
            // Agar statusGroup.status newStatus se match karta hai (e.g., "in progress")
            // To us group mein result.task add karo (API se updated task)
            : statusGroup
            // Warna, group ko waise ka waise rakho
           )
      }));
             // Step 4: New state return karo
               return { tasks: newTasks };
            // Store ko newTasks set karo—UI update ho jayega
    });

    set({ loading: false });

  } catch (error) {

    set({ error: error.message, loading: false });

  }
},


  // setTask action: Tasks ko manually set karo (consistency ke liye)
  setTask: (tasks) => set({ tasks }),  // State me tasks update karo

}));