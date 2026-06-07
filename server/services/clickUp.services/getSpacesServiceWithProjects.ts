// Service: Spaces fetch with projects populated
// Purpose: DB se spaces lao aur projects populate karo, taake sidebar mein use ho sake
// Populate ka matlab hai ke Space model mein projects field mein ObjectIds hain (IDs), .populate('projects') woh IDs ko full Project objects mein convert kar deta hai, taake name, etc. sab aaye.

// imports
import Space from '@/server/models/clickUp_Models/clickUp_Space';  // Space model import
import '@/server/models/clickUp_Models/clickUIp_Projects';  // Add import, model register karne ke liye (even if not used)


export const SpacesServiceWithProjects = async () => {

  try {

    // Spaces find karo aur projects populate karo
    const spaces = await Space.find().populate('projects');  // populate('projects') se project objects aayenge

       console.log("Service: Spaces fetched:", spaces);  // Add log with data

    return spaces;  // Array return karo

  } catch (error) {

        console.error("Service error details:", error);  // Add detailed log
        
    throw new Error(`Error fetching spaces: ${error.message}`);  // Error handle

  }

};