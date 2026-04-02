// import mongoose from "mongoose";
// import { validateEnv } from "./validateEnv";

// let isConnected = false; // global flag for dev to avoid multiple connections

// export  const connectDB = async() =>{
//     if(isConnected){
//         return;
//     };

//     try{
//         // Validate environment variables FIRST
//         const env = validateEnv();
        
//         // Now we know MONGO_URI is valid
//         const MONGO_URI = env.MONGO_URI;

//         const conn = await mongoose.connect(MONGO_URI);
//         isConnected = true;

//     } catch (err) {
//          throw new Error("Database connection failed");
//     }
// }


// for production 
// ================================================================
// MongoDB Connection + Environment Validation Helper
// ================================================================

//  Import mongoose for MongoDB connection
import mongoose from "mongoose";

//  Import our Zod-based env validation function
import { env } from "./validateEnv";

//  Import logger for structured logging
import logger from "./logger";

// ================================================================
// Function to connect to MongoDB safely
// ================================================================
export const connectDB = async () => {
      
    // Step 1: Check if already connected
    // Mongoose stores all connections in mongoose.connections array
    // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connections[0]?.readyState === 1) {
        logger.info(" MongoDB already connected ");
        return;
    }

    try {
        //  Step 2: Connect to MongoDB using mongoose.connect()
        // Options explained:
        // serverSelectionTimeoutMS: 5000 → fail fast if DB unreachable (5 seconds)
        await mongoose.connect(env.MONGO_URI, { // env validation env se validate hua he 
            serverSelectionTimeoutMS: 5000,
        });

        //  Step 3: Connection successful
        // Log for monitoring / development purposes
        logger.info("MongoDB connected successfully");

    } catch (err) {
        //  Step 4: Connection failed
        // Log actual error for debugging
        logger.error("Database connection failed", { error: err });

        // Throw error so API routes / startup know DB is not ready
        throw new Error("Database connection failed");
    }

}