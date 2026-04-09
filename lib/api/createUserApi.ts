// create user SSR fetch work API Call
//  POST Req

// imports
 import { Roles } from "../../types/clickUp_User.Type"; // role emun alag se 
import API_URL from "@/config/api";

// interface
interface UserFormData {
  name: string;
  email: string;
  role: Roles; // role enum
  department: string;
  skills: string[]; // Array
  experienceLevel: string;
  manager: string;
}

// create an new user API function
export async function createUser( UserFormData ) {

    try {

        const res = await fetch(`${API_URL}/api/users`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(UserFormData)
        });

        //  agar res ok ni he 
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'failed to create user')
        }

        const data = await res.json();
        return data;


    } catch (err: unknown) {
      if (err instanceof Error) {
       throw err;
     } else {
      throw new Error("Something went wrong");
     }

   }
 
};