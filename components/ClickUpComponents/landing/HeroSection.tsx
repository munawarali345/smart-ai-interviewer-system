// ================================
// Hero Section Component
// ================================
// Purpose: Main landing section with headline, description, CTAs, and mockup area

'use client'; // Client component for Framer Motion

import React from 'react'; // React import
import { motion } from 'framer-motion'; // Framer Motion for animations
import { ArrowRight, Play, Brain, CheckSquare } from 'lucide-react'; // Icons for buttons
import { Button } from '@/components/ui/button'; // Shadcn Button

// ================================
// Hero Section
// ================================
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-32">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-200 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8"
            >
              <Brain className="w-4 h-4 mr-2" />
              Introducing ClickUp
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Revolutionize Your Projects with
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Task Management
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl leading-relaxed"
            >
              Experience personalized task generation, automated reviews, and structured professional growth.
              Learn by doing real work with automated guidance and AI-powered feedback.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Sign Up Button */}
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                Sign Up
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              {/* Watch Demo Button */}
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-4 text-lg font-semibold rounded-xl"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-12 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Free 14-day trial</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end relative z-10"
          >
            <div className="relative">
              {/* Main Dashboard Card - Larger and More Prominent */}
              <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-2xl w-full transform hover:scale-105 transition-all duration-500">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">Your WorkSpace</h3>
                      <p className="text-sm text-gray-500">Personalized Workflow</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>

                {/* Task Cards */}
                <div className="space-y-5">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Complete API Integration</h4>
                        <p className="text-sm text-gray-600 mb-2">Build RESTful endpoints with authentication</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">High Priority</span>
                          <span className="text-xs text-gray-500">Due: Tomorrow</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-blue-400 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Database Optimization</h4>
                        <p className="text-sm text-gray-600 mb-2">Improve query performance and indexing</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Medium Priority</span>
                          <span className="text-xs text-gray-500">Due: Friday</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-gray-300 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Code Review Preparation</h4>
                        <p className="text-sm text-gray-600 mb-2">Prepare code for peer review and testing</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Low Priority</span>
                          <span className="text-xs text-gray-500">Due: Next Week</span>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span className="font-medium">Overall Progress</span>
                    <span className="font-bold text-blue-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full w-3/4 transition-all duration-1000 shadow-sm"></div>
                  </div>
                </div>
              </div>

              {/* Floating Achievement Badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -top-8 -right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl border-2 border-white"
              >
                🎯 Task Completed!
              </motion.div>

              {/* Additional Floating Elements */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-6 -left-6 bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg"
              >
                AI Generated
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}