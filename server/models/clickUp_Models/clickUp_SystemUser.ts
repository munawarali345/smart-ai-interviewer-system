
import mongoose, { Schema } from "mongoose";
import { ISystemUser } from "@/types/clickUp_SystemUser.type";

const systemUserSchema = new Schema<ISystemUser>({
  name: { type: String, required: true },
  role: { type: String, default: "system", required: true },
});

// Export sytem user model
export default mongoose.models.clickUpSystemUser || mongoose.model<ISystemUser>("clickUpSystemUser", systemUserSchema );

