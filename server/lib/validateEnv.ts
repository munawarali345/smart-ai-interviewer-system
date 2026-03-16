// ================================================================
// Environment Variables Validation using Zod
// ================================================================
// Purpose: Check that all required environment variables exist
// When: Runs when app starts, before any database or API calls

// Import Zod library for validation
import { z } from 'zod';

// Import logger for structured logging
import logger from './logger';

// Define what environment variables we need
const envSchema = z.object({
    //  MONGO_URI must be a non-empty string
    MONGO_URI: z.string().nonempty("MONGO_URI is required"),
    
    //  GROQ_API_KEY must be a non-empty string  
    GROQ_API_KEY: z.string().nonempty("GROQ_API_KEY is required"),
    
    //  NEXT_PUBLIC_API_URL is optional, but if provided must be valid URL
    NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

//  Validate all environment variables at once
// process.env contains all environment variables from Node.js
const parsedEnv = envSchema.safeParse(process.env);

// If validation failed, print error and stop server
if (!parsedEnv.success) {
    // Print main error message
    logger.error('Environment validation failed:');
    
    // Print detailed error (Zod formats it automatically)
    logger.error(parsedEnv.error.format());
    
    //  Stop the server - don't start with invalid config
    process.exit(1);
}

// If validation passed, export the validated data
// Now we know MONGO_URI and GROQ_API_KEY exist
export const env = parsedEnv.data;

//  Simple function to get validated environment
export function validateEnv() {
    return env;
}
