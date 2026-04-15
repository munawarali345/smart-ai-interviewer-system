// get user by ID API Call 
import API_URL from "@/config/api";

// main fucntion API CALL
export default async function getUserById( userId: string ) {

    try {

         const res = await fetch(`${API_URL}/api/users/${userId}`);  // Relative URL

        //  agar res ok ni he to
        if (!res.ok) {
            throw new Error('failed to fetch user');
        }

        // responce me yaha data mila
        const data = await res.json();

        // data se user nikal k retun kr denge 
        return data.user;

    } catch (err: unknown) {
      if (err instanceof Error) {
       throw err;
     } else {
      throw new Error("Something went wrong");
     }

   }
 }