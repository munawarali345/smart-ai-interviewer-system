// ================================
// Workflow Section Component
// ================================
// Purpose: Show step-by-step process of how the AI system works

'use client'; // Client component for Framer Motion

import React, { useState, useEffect } from 'react'; // React import
import { motion } from 'framer-motion'; // Framer Motion for animations

// ================================
// Workflow Steps Data
// ================================
const workflowSteps = [
  {
    step: 1,
    title: 'Profile Analysis',
    description: 'AI agents analyze your skills, experience level, and department to understand your professional background.',
  },
  {
    step: 2,
    title: 'Smart Task Generation',
    description: 'Intelligent agents create personalized tasks based on your profile, ensuring appropriate challenge level.',
  },
  {
    step: 3,
    title: 'Intelligent Task Management',
    description: 'Real-time task tracking, progress monitoring, and intelligent prioritization with automated guidance.',
  },
  {
    step: 4,
    title: 'AI-Powered Feedback',
    description: 'Receive detailed AI analysis of your work, personalized recommendations, and growth insights.',
  },
];

// ================================
// Scroll Tracker Component
// ================================
function ScrollTracker() {
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const stepElements = document.querySelectorAll('[data-step]');
      let currentActive = 0;

      stepElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const windowHeight = window.innerHeight;

        // If element is in viewport (with some offset)
        if (elementTop < windowHeight * 0.6 && elementTop > -rect.height * 0.4) {
          currentActive = index;
        }
      });

      setActiveStep(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate position based on active step
  const getDotPosition = () => {
    const positions = ['8px', 'calc(33.333% - 8px)', 'calc(66.666% - 8px)', 'calc(100% - 32px)'];
    return positions[activeStep] || '8px';
  };

  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full shadow-lg border-2 border-white"
      animate={{ top: getDotPosition() }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>

      {/* Active step indicator glow */}
      <motion.div
        className="absolute inset-0 bg-blue-400 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

// ================================
// Workflow Step Component
// ================================
function WorkflowStep({ step, index }: { step: typeof workflowSteps[0]; index: number }) {
  return (
    <div
      data-step={`step-${index}`}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 max-w-md w-full group relative"
    >
      {/* Step Number */}
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 font-bold text-lg rounded-full mb-6 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all duration-300">
        {step.step}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
        {step.description}
      </p>

      {/* Connection arrow for non-last items */}
      {index < workflowSteps.length - 1 && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-blue-500 text-2xl animate-bounce">
          ↓
        </div>
      )}
    </div>
  );
}

// ================================
// Workflow Section
// ================================
export default function WorkflowSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How Our AI System
            <span className="text-blue-600">
              {' '}Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience intelligent task generation and automated review through our AI-powered learning platform
          </p>
        </motion.div>

        {/* Workflow Timeline - Improved Vertical Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Enhanced Connecting Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-24 bottom-24 w-1">
            <div className="h-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400 rounded-full shadow-inner"></div>

            {/* Scroll-tracked main flow indicator */}
            <ScrollTracker />
          </div>

          {/* Workflow Steps */}
          <div className="relative space-y-20">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex items-center ${index % 2 === 0 ? 'justify-start pr-12' : 'justify-end pl-12'}`}
              >
                <WorkflowStep step={step} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}