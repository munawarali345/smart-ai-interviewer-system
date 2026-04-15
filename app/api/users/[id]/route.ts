// user create hune k bad usi perticuller usr k dashboard me jane k liye 
//  abi auth system yaha ni he to iddynamic id se kar raha he in future auth lage ga JWT token se huga

// imports 
import { NextRequest, NextResponse } from "next/server";
import User from '@/server/models/clickUp_Models/clickUp_User' // user model
import mongoose from "mongoose";
import { connectDB } from "@/server/lib/db";
import logger from "@/server/lib/logger";


// main get api functon works start here
export async function GET(req: NextRequest, {params}: {params: Promise<{id: string}>  }) {

    try {

        //  step 1: db connect
        await connectDB();

        // step 2: params se id ko nikalnge 
        const paramsResolved = await params;
        const { id } = paramsResolved;

        // step 3: ID ko validate karenge
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(

                { success: false, message: "Invalid user ID format" },
                { status: 400 }

            );
        }

        // step 4: find user from DB 
        const user = await User.findById(id);

        // step 5: validate user ha ya ni 
        // agar user ni he 
        if (!user) {
            return NextResponse.json(

                { success: false, message: "User not found" },
                { status: 404 }

            );
        }

        // step 6: responce retrun ker do us me user ko 
        return NextResponse.json({ 

            success: true,
            user,
        });

    } catch (error) {

        logger.error("Error fetching user", { error: error instanceof Error ? error.message : error });

     return NextResponse.json(
        
      { success: false, message: "Failed to fetch user" },
      { status: 500 }

    );

    }
}