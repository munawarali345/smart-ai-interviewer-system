// ================================
// Main Page - AI Interview System
// ================================
// Purpose: Landing page that uses existing ResumeUpload component

// ================================
// Imports
// ================================
// Lucide icons
import { Bot, FileText, CheckCircle } from "lucide-react";
// Existing ResumeUpload component
import ResumeUpload from "@/components/ResumeUpload";



// ================================
// Main Component
// ================================
export default function HomePage() {

  // ================================
  // Render
  // ================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  AI Interview System
                </h1>
                <p className="text-sm text-slate-500">
                  Powered by Groq AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to AI-Powered Interviews
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your resume and get personalized interview questions based on your skills and experience.
          </p>
        </div>

        {/* Upload Card */}
        <div className="max-w-xl mx-auto">
          {/* Card Container */}
          <div className="bg-white rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900">
                Upload Your Resume
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>

            {/* Card Body - Using Existing ResumeUpload Component */}
            <div className="p-6">
              <ResumeUpload />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Smart Resume Parsing
            </h3>
            <p className="text-slate-600">
              AI automatically extracts your skills and experience from resume
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <Bot className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Personalized Questions
            </h3>
            <p className="text-slate-600">
              Get interview questions tailored to your tech stack
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Instant Feedback
            </h3>
            <p className="text-slate-600">
              Get detailed feedback on your answers instantly
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}