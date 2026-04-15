//  ye dashboard k sidebar ka componenet he

// Sidebar Component: Left sidebar for navigation sections
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Folder, CheckSquare, UserCheck, MessageSquare, Calendar, List } from 'lucide-react';  // User icon hata diya
import Link from "next/link";

export default function Sidebar() {

  return (

     <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 min-h-screen">

         {/* Assigned Comments Section: Simple button (onClick bad me) */}
      <div className="mb-6">

        <Button variant="ghost" className="w-full justify-start flex items-center gap-2 font-semibold">

        <UserCheck className="w-4 h-4" />

          Assigned Comments

        </Button>

      </div>

         {/* Chat Activity Section: Simple button (onClick bad me) */}
      <div className="mb-6">

        <Button variant="ghost" className="w-full justify-start flex items-center gap-2 font-semibold">

        <MessageSquare className="w-4 h-4" />

         Chat Activity

        </Button>

      </div>

      {/* Spaces Section: Simple button (onClick bad me) */}
      <div className="mb-6">

        {/* All Spaces button ko Link me wrap */}
         <Link href="/clickup/dashboard/spaces">

            <Button variant="ghost" className="w-full justify-start flex items-center gap-2 font-semibold">

             <Folder className="w-4 h-4" />

                All Spaces

            </Button>
            
           </Link>

      </div>

    {/* Tasks Section: Simple buttons */}
    <div>

      {/* All Tasks button ko Link me wrap */}
      <Link href="/clickup/dashboard/AllTasks">

       <Button variant="ghost" className="w-full justify-start flex items-center gap-2 font-semibold">

        <CheckSquare className="w-4 h-4" />

          All Tasks

        </Button>

       </Link>

      </div>

      {/* My Tasks Section: Accordion */}
      <div className="mb-6">

        <Accordion type="single" collapsible defaultValue="my-tasks">

          <AccordionItem value="my-tasks">

            <AccordionTrigger className="flex items-center gap-2 font-semibold">

               <CheckSquare className="w-10 h-4" />

                   My Tasks
            </AccordionTrigger>

          <AccordionContent className="pb-0">  {/* Padding adjust */}

              <div className="space-y-1">  {/* No pl-6 */}
                
                <Button variant="ghost" className="w-full justify-start flex items-center gap-2 ml-6">  {/* Manual indent */}

                  <UserCheck className="w-4 h-4" />

                  Assigned to Me

                </Button>

                <Button variant="ghost" className="w-full justify-start flex items-center gap-2 ml-6">

                  <Calendar className="w-4 h-4" />

                  Today & Overdue

                </Button>

                <Button variant="ghost" className="w-full justify-start flex items-center gap-2 ml-6">

                  <List className="w-4 h-4" />

                  Personal List

                </Button>

              </div>

            </AccordionContent>

          </AccordionItem>

        </Accordion>

      </div>

       {/* Divider: Sections ko separate karne ke liye */}
      <hr className="my-4 border-gray-300" />  {/* Subtle horizontal line */}

         {/* My Tasks Section: Accordion */}
      <div className="mb-6">

        <Accordion type="single" collapsible defaultValue="spaces">

          <AccordionItem value="spaces">

            <AccordionTrigger className="flex items-center gap-2 font-semibold">

               <CheckSquare className="w-10 h-4" />

                   Spaces
            </AccordionTrigger>

          <AccordionContent className="pb-0">  {/* Padding adjust */}

              <div className="space-y-1">  {/* No pl-6 */}
                
                <Button variant="ghost" className="w-full justify-start flex items-center gap-2 ml-6">  {/* Manual indent */}

                  <UserCheck className="w-4 h-4" />

                  All Tasks

                </Button>

              </div>

            </AccordionContent>

          </AccordionItem>

        </Accordion>

      </div>
      

    </aside>

  );

}