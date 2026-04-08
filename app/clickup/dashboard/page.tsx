// main clickUp Dashboard page

// imports
import Link from "next/link";

// main function 
export default function ClickUpDashboard () {

    // jsx ui work
    return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">ClickUp WorkSpace</h1>
              <Link href="/clickup/createUser" className="bg-blue-600 text-white  px-4 py-2 rounded-lg hover:bg-blue-700">
                  Create User
              </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900">Welcome to ClickUp</h2>
        <p>Your AI-powered task management system.</p>
      </div>
    </main>
  );
}