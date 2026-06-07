// Sidebar Spaces API Route - GET spaces with projects populated for sidebar accordions

// imports 
import { NextRequest, NextResponse } from "next/server";
import { SpacesServiceWithProjects } from "@/server/services/clickUp.services/getSpacesServiceWithProjects";  // Service import
import logger from "@/server/lib/logger";  // Logger import for error logging
import { connectDB } from "@/server/lib/db";  // DB connect import

/// GET function starts  // Comment: Function shuru
export async function GET(req: NextRequest) {  // Async function, GET request handle karta hai

    try {

        // step 1: db connect karo
        await connectDB();

        // step 2: service call karo : populated spaces lao with projects
        const spaces = await SpacesServiceWithProjects();

        // step 3: responce return: spaces array with projects
        return NextResponse.json({ spaces })

    } catch (error) {
      // error log
      logger.error("Error fetching spaces for sidebar", { error });
    
      // error response
      return NextResponse.json(

         {
            success: false,

            message: "Failed to fetch spaces"

         }, { status: 500 }

    );
  }

}