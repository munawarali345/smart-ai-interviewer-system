// User Form Component - ClickUp User Creation
'use client'

// Imports
import { useState } from "react";
import { createUser } from "@/lib/api/createUserApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Router import

interface userFormData {
  name: string;
  email: string;
  role: string;
  department: string;
  skills: string[]; // Array
  experienceLevel: string;
  manager: string;
}

// Main Component
export default function UserForm() {
  const router = useRouter(); // Router instance

  // Form State - IUserPayload type se
  const [formData, setFormData] = useState<userFormData>({
    name: "",
    email: "",
    role: "",
    department: "",
    skills: [], // Array for skills
    experienceLevel: "",
    manager: "",
  });

  // UI States
  const [loading, setLoading] = useState(false);

  // Handle Input Changes - Generic for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Skills Change - Convert string to array
   // 1. Input change event leta hai
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

      // 2. Input ki value (string) nikalti hai, jaise "React, Node, JS"
    const { value } = e.target;

     // 3. String ko "," se split karti hai → ["React", " Node", " JS"]
  // 4. Har skill ko trim() se spaces hataati hai → ["React", "Node", "JS"]
    const skillsArray = value.split(",").map((s) => s.trim());

      // 5. State mein skills ko array se update karti hai
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // user creating api call 
      const result = await createUser(formData);
      if (result.success) {
        toast.success(result.message);
        router.replace("/clickup/dashboard"); // Redirect to dashboard
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // JSX UI
  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg border border-slate-200 shadow-lg">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <h2 className="text-xl font-semibold text-slate-900">Create New User</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />

        {/* Email Input */}
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        {/* Role Select */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="developer">Developer</option>
          <option value="tester">Tester</option>
          <option value="manager">Manager</option>
          <option value="designer">Designer</option>
        </select>

        {/* Department Select */}
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>Select Department</option>
          <option value="engineering">Engineering</option>
          <option value="qa">QA</option>
          <option value="production">Production</option>
          <option value="design">Design</option>
          <option value="hr">HR</option>
          <option value="marketing">Marketing</option>
        </select>

        {/* Skills Input */}
       <Input
         type="text"  // Text input banata hai
         name="skills"  // Form handling ke liye name
         value={formData.skills.join(", ")}  // Array ko string mein convert ("React, Node")
         onChange={handleSkillsChange}  // Change pe array update
         placeholder="Skills (comma separated)"  // User hint
        //  className="input"  // Styling class
        />

        {/* Experience Level Select */}
        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select experienceLevel</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="intern">Intern</option>
        </select>

        {/* Manager Input */}
        <Input
          type="text"
          name="manager"
          value={formData.manager}
          onChange={handleChange}
          placeholder="Manager (optional)"
        />

        {/* Submit Button */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create User"}
        </Button>
      </form>
    </div>
  );
}

// Component Ends