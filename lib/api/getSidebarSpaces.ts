// getSidebarSpaces API Call - Spaces with projects populated for sidebar

// imports 
import API_URL from "@/config/api"; // API base API_URL

// main function
export default async function getSidebarSpaces() {

    try {

        // API call to sidebar spaces route
        const res = await fetch(`${API_URL}/api/spaces/sidebar`);

        // Check if response ok
        if ( !res.ok ) {

            throw new Error('Failed to fetch sidebar spaces');

        }

        //  Parse JSON response
        const data = await res.json();

        // return spaces array with populates projects
        return data.spaces;

    } catch (error) {
       // Log error
       console.error('Error in getSidebarSpaces:', error);
    
       // Throw error to caller
      throw error;
  };

}