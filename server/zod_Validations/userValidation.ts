// ================================================================
// User Validation Schema - Zod
// ye api level validation k liye 
// Zod: Fast API response, detailed errors, user experience
//Frontend → Zod Validation  → Schema Validation  → Database Save 
// ================================================================
// Purpose: User creation aur updates ki validation ke liye
// When: Frontend se data aane pe aur API calls pe

import { z } from "zod";

// user creation validation schema
export const createUserSchema = z.object({

    name: z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),

    email: z.string()
         .email('Please enter a valid email address')
         .toLowerCase()
         .trim(), 
         
    role: z.enum(['frontend', 'backend', 'fullstack', 'mobile_developer', 'tester', 'automation_tester', 'designer', 'content_creator', 'marketing'], {
         message: 'Role must be one of: developer, tester, manager, designer' //  Custom error message deta hai (better UX)
       }),

    department: z.enum(['engineering', 'qa', 'product', 'design', 'hr', 'marketing'], {
          message: 'Department must be one of: engineering, qa, product, design, hr, marketing'
       }),

    skills: z.array(z.string().trim().min(1, 'Skill cannot be empty'))
        .min(1, 'At least one skill is required')
        .max(20, 'Cannot have more than 20 skills'),

    experienceLevel: z.enum(['junior', 'mid', 'senior', 'intern'], {
         message: 'Experience level must be one of: junior, mid, senior, intern'
      }).optional(),


    manager: z.string()
        .max(100, 'Manager name cannot exceed 100 characters')
        .trim()
       .optional()
   });




// ================================================================
// TypeScript Type Exports
// Auto-generated types from Zod schemas for type safety
// ================================================================
export type CreateUserInput = z.infer<typeof createUserSchema>;