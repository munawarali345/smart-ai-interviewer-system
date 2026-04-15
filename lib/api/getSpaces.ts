// getSpaces API Call - All spaces fetch

import API_URL from "@/config/api";

//  main function api call
export default async function getSpaces() {

    try {

        const res = await fetch(`${API_URL}/api/spaces`) // API CALL

        if (!res.ok) {
            throw new Error('Failed to fetch spaces');
        }

        const data = await res.json(); // responce yaha hame data me spaces mil re he 

        return data.spaces // spaces arrey return

    } catch (error) {

    console.error('Error in getSpaces:', error);
    
    throw error;  // Error throw
  }

}