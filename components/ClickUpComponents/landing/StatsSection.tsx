// ================================
// Stats Section Component
// ================================
// Purpose: Display animated counters for trust indicators

'use client'; // Client component for hooks

import React, { useState, useEffect } from 'react'; // React hooks
import { motion } from 'framer-motion'; // Framer Motion
import { useInView } from 'framer-motion'; // For scroll trigger
import { Users, Brain, Target, TrendingUp } from 'lucide-react'; // Stat icons

// ================================
// Stats Data
// ================================
const stats = [
  {
    icon: Users,
    value: 50000, // Target value for animation
    label: 'Active Learners',
    suffix: '+',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    value: 2000000,
    label: 'AI-Generated Tasks',
    suffix: '+',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    value: 150000,
    label: 'Tasks Reviewed',
    suffix: '+',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    value: 95,
    label: 'Success Rate',
    suffix: '%',
    gradient: 'from-orange-500 to-red-500',
  },
];

// ================================
// Animated Counter Hook
// ================================
function useAnimatedCounter(targetValue: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(targetValue * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return count;
}

// ================================
// Stat Card Component
// ================================
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  // Icon component ko variable me store karo
  const IconComponent = stat.icon;

  // Animated counter only when in view
  const animatedValue = useAnimatedCounter(isInView ? stat.value : 0);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-blue-200 group-hover:scale-105">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="h-8 w-8 text-white" />
        </div>

        {/* Animated Counter */}
        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {animatedValue.toLocaleString()}{stat.suffix}
        </div>

        {/* Label */}
        <div className="text-gray-600 font-semibold group-hover:text-gray-800 transition-colors duration-300">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

// ================================
// Stats Section
// ================================
export default function StatsSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
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
            Trusted by
            <span className="text-blue-600">
              {' '}Professionals Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their productivity with our AI-powered task management platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}