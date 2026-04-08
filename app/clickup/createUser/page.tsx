// main user creation page 
import UserForm from "@/components/ClickUpComponents/UserForm";

// main function
export default function UserCreationgPage() {

    return (

     <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      <UserForm />
    </div>

    );
}