// ================================
// CTA Section Component
// ================================
// Purpose: Final call-to-action section to convert visitors

'use client'; // Client component for Framer Motion

import React from 'react'; // React import
import { motion } from 'framer-motion'; // Framer Motion
import { ArrowRight, Sparkles } from 'lucide-react'; // Icons
import { Button } from '@/components/ui/button'; // Shadcn Button

// ================================
// CTA Section
// ================================
export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"
          animate={{
            scale: [1.5, 1, 1.5],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full blur-xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Sparkles Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
        >
          Ready to Boost Your
          <span className="block text-yellow-300">
            Personal Productivity?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}

          className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of professionals who have revolutionized their task management with AI-powered insights.
          Start your intelligent productivity journey today and unlock your full potential.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          {/* Primary CTA */}
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-5 text-xl font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 rounded-2xl transform hover:scale-105"
          >
            Start Free Trial
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>

          {/* Secondary CTA */}
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/10 px-12 py-5 text-xl font-bold backdrop-blur-sm rounded-2xl hover:scale-105 transition-all duration-300"
          >
            Schedule Demo
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-white/80 text-base"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="font-medium">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="font-medium">14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="font-medium">Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}