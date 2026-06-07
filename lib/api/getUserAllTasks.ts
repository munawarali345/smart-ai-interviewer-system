// yaha current user ki sari tasks ko fetch karenge user id se Assignees: userId

import API_URL from "@/config/api";

// Tasks fetch API main function
export default async function getUserAllTasks(userId: string, spaceId?: string, projectId?: string ) {

  try {

    // Base URL
    let apiUrl = `${API_URL}/api/tasks?userId=${userId}`;

     // Filters add if provided
    if (spaceId) apiUrl += `&spaceId=${spaceId}`;
    if (projectId) apiUrl += `&projectId=${projectId}`;
 
    const res = await fetch(apiUrl); // api call 

   

    if (!res.ok) throw new Error('Failed to fetch tasks');

    const data = await res.json();

    return data.data;  // Tasks array return

  } catch (error) {

    console.error('Error in getTasks:', error);

    throw error;
  }

}