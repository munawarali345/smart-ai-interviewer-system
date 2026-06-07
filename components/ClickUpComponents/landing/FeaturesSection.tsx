// ================================
// Features Section Component
// ================================
// Purpose: Showcase key features with animated cards in bento grid layout

'use client'; // Client component for Framer Motion

import React from 'react'; // React import
import { motion } from 'framer-motion'; // Framer Motion for animations
import { useInView } from 'framer-motion'; // For scroll-triggered animations
import { Brain, Folder, CheckCircle, Target, Users, BarChart3 } from 'lucide-react'; // Feature icons
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Shadcn Card components

// ================================
// Features Data Array
// ================================
// Features ko array me define kar rahe hain taake scalable rahe
const features = [
  {
    icon: Brain, // Icon component
    title: 'AI-Powered Task Management',
    description: 'Intelligent AI agents analyze team profiles and generate optimized tasks based on experience levels, department, and project requirements.',
    gradient: 'from-blue-500 to-purple-500', // Tailwind gradient classes
  },
  {
    icon: Folder,
    title: 'Dynamic Project Spaces',
    description: 'Organize work into department-based spaces with projects that adapt to your teams changing needs and priorities.',
    gradient: 'from-green-500 to-blue-500',
  },
  {
    icon: CheckCircle,
    title: 'Automated Progress Tracking',
    description: 'AI-driven progress monitoring with real-time updates, milestone tracking, and intelligent deadline predictions.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    title: 'Smart Resource Allocation',
    description: 'AI analyzes team capacity and automatically suggests optimal task assignments based on skills and availability.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: 'Intelligent Team Collaboration',
    description: 'Enhanced team communication with AI-powered insights, conflict resolution suggestions, and collaboration analytics.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics Dashboard',
    description: "Comprehensive project analytics with predictive insights, resource utilization reports, and performance optimization recommendations.",
    gradient: 'from-indigo-500 to-purple-500',
  },
];

// ================================
// Feature Card Component
// ================================
// Reusable component for each feature card with animated borders
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  // useInView hook for scroll animation
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true }); // Animate only once when in view

  // Icon component ko variable me store karo
  const IconComponent = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }} // Initial hidden state
      animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate when in view
      transition={{ duration: 0.6, delay: index * 0.1 }} // Staggered animation
      className="group relative" // Group for hover effects
    >
      {/* Animated Border with Moving Dots */}
      <div className="absolute inset-0 rounded-2xl">
        {/* Corner dots */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>

        {/* Moving border lines */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-400 transition-all duration-500">
          <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-700"></div>
          <div className="absolute top-0 right-0 w-0.5 h-0 bg-gradient-to-b from-purple-400 to-indigo-400 group-hover:h-full transition-all duration-700 delay-200"></div>
          <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-indigo-400 to-pink-400 group-hover:w-full transition-all duration-700 delay-400"></div>
          <div className="absolute bottom-0 left-0 w-0.5 h-0 bg-gradient-to-t from-pink-400 to-blue-400 group-hover:h-full transition-all duration-700 delay-600"></div>
        </div>

        {/* Floating particles */}
        <motion.div
          className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100"
          animate={{
            y: [0, -10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
          animate={{
            y: [0, 10, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>

      <Card className="relative h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          {/* Icon with gradient background */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <IconComponent className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-gray-900 text-xl font-bold group-hover:text-blue-600 transition-colors duration-300">
            {feature.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {feature.description}
          </p>
        </CardContent>

        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </Card>
    </motion.div>
  );
}

// ================================
// Features Section
// ================================
export default function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>

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
            AI-Powered Features for
            <span className="text-blue-600">
              {' '}Modern Project Management
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience intelligent project management with AI-driven task optimization, automated workflows, and predictive analytics
          </p>
        </motion.div>

        {/* Feature Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}