// ye tool he pehle se task mojood he ya ni check karega agar mojood he to hame kuc cheezn cahiye hungi wo hum agent ko retrun karenge 

import Task from '@/server/models/clickUp_Models/clickUp_Task';

// main function
export async function checkExistingTask ( taskKey: string, phase: string ) {

// Query for reusable tasks (onboarding, same taskKey, phase, department, role)
 const existingTask = await Task.findOne ({

    taskKey,
    phase

 });

 return existingTask || null;  // Return task if found, else null

}