// ye clickUp user ki services he yaha se user create huga 

// imports 
import User from "@/server/models/clickUp_Models/clickUp_User"; // user model
import { CreateUserInput } from "@/server/zod_Validations/userValidation";
import logger from "@/server/lib/logger";
import { createTaskForUser } from "./clickUp.task";

// create user function starts from here
 export const createUser = async (data: CreateUserInput ) =>{
 
    try{

        logger.info("Creating an new user", {email: data.email});

        // 1 check dupliacate email
        const existingEmail = await User.findOne( { email: data.email } );
        
        // chek karo agar email exist karti he to new error throw kro
        if(existingEmail) {
            logger.warn("duplicate user attemps", {email: data.email});
            throw new Error("user with this email already exist");
        }

        // 2 crearte user 
        const user = await User.create( data );
        logger.info("user created successfully", {userId: user._id});

        // step 3 autometicallty task assign to user 
        // user create hua user mila yaa task service ko call kia usko user beja
        // user k liye task create AI Agent Call
        await createTaskForUser(user);

        return user;

    } catch (error: any) {
        //  Step 1: Check if error is MongoDB duplicate key error
        //  code 11000 = unique field (like email) already exists in DB
        if (error.code === 11000) {
    
      //  Log specific duplicate error for debugging
        logger.error("Mongo duplicate key error", {
        email: data.email, // kis email pe error aya
       });

     // Send clean message to service/controller
        throw new Error("Duplicate email not allowed");
       }

     // Step 2: If it's NOT a duplicate error
    // then log full error details for debugging
       logger.error("Error creating user", {
        message: error.message, // actual error message
         stack: error.stack,     // kaha error hua (file + line info)
       });

    //  Step 3: Final fallback error
    // agar error known nahi hai to generic message bhejo
        throw new Error(error.message || "Failed to create user");
       }
 }
// ends here