// Spaces API Route - GET all spaces

// imports 
import { NextRequest, NextResponse } from "next/server";
import Space from "@/server/models/clickUp_Models/clickUp_Space";  
import logger from "@/server/lib/logger";
import { connectDB } from "@/server/lib/db";

/// GET function starts  // Comment: Function shuru
export async function GET(req: NextRequest) {  // Async function, GET request handle karta hai

    try {  // Try block: Normal flow

        // db connects
         await connectDB();
        
        // spaces fetch from DB  // Comment: Spaces lao
        const spaces = await Space.find();  // Mongoose se sare spaces find karo, array return karta hai

        // response return with spaces  // Comment: Response bhejo
        return NextResponse.json({ spaces });  // JSON response with spaces array, status 200 auto

    } catch (error) {  // Catch block: Error handle
        
        // error log  // Comment: Error log karo
        logger.error("Error fetching spaces", { error });  // Logger se error record karo

        // error response  // Comment: Error response bhejo
        return NextResponse.json(  // JSON error response
            {  // Object
                success: false,  // Success flag false
                message: "Failed to fetch spaces"  // Error message
            },
            { status: 500 }  // HTTP status 500 (server error)
        );
    }
}

// ends here  // Comment: Function khatam