// ================================================================
// Interface: ISpace
// Purpose: Ye define karta hai structure space ka
// Notes: Space = ek department-level container jahan projects rahenge
// ================================================================ 

import  {Document, Types} from "mongoose";

// ================================================================
// Interface: IProject (populated object ke liye)
// ================================================================
export interface IProject {
  _id: string;
  name: string;
}


// interface starts from here
export interface ISpace extends Document {

    // validation k liye match karenge user ka department k pehese he ya nni
    name: string,

    // Optional description space ki
    description?: string,

    // validation k liye match karenge user ka department k pehese he ya ni
    // Department jo is space se related hai (logic ke liye)
    // Example: "engineering", "marketing", "design"
    department: string,  
    
    // Array of projects ids jo is space me linked hain
    projects?: IProject[],

    // Space ke members (department ke users)
    members: Types.ObjectId[];

    // Timestamp jab space create hua
    createdAt?: Date;

    // Timestamp jab space last update hua
    updatedAt?: Date;
}
// ends here