// ================================================================
// ClickUp User Model - Mongoose Schema
// ================================================================
// Purpose: Store ClickUp users in MongoDB with proper validation
// When: When new user is created via frontend form
// Relations: Connected to Task model via userId reference

// imports
import mongoose, { Schema } from "mongoose";
import { IUser, Roles } from "../../../types/clickUp_User.Type"; // Import the IUser interface from the types file


// clickUp user Schema
const userSchema: Schema<IUser> = new Schema ({

    // basic information 
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [100, 'Name cannot execeed 100 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },

    // professional information
    role: {
        type: String,
        required: [true, 'role is required'],
        enum: Object.values(Roles)
    },

    department: {
        type: String,
        required: [true, 'departmnet is required'],
         enum: {
            values : ['engineering', 'qa', 'production', 'design', 'hr', 'marketing' ],
             message: 'Department must be one of: engineering, qa, production, design, hr, marketing'
        }
    },

    skills: {
        type: [String],
        required: [true, 'skills are required'],
        validate: {
            validator: function(v: string[]) {
                return v.length > 0;
            },

            message: ' At least one skill is required'
        }
    },

    // optional professional feilds
    experienceLevel: {
        type: String,
         enum: {
            values : [ 'junior', 'mid', 'senior', 'intern' ],
             message: 'experience must be one of: junior, mid, senior, intern,'
        }
    },

    manager: {
        type: String,
        trim: true,
        maxlength: [100, 'manager name cannot exceed 100 characters']
    },

}, {
     timestamps: true
});

// indexes for performanc
userSchema.index({department: 1, role: 1}); // department and role filtering

userSchema.index({ createdAt: -1}); // recent users first
// indexing ends here 


// Export user model
export default mongoose.models.ClickUpUser || mongoose.model<IUser>("ClickUpUser", userSchema);