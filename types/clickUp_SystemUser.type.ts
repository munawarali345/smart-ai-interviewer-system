// ye sytem usr ka interface he just ai actions ko handle karne k liye banya he 
import  {Document} from "mongoose";

export interface ISystemUser extends Document {
  name: string;
  role: "system";
};
