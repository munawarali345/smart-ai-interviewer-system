// ================================
// Testimonials Section Component
// ================================
// Purpose: Display user testimonials with sliding animation

'use client'; // Client component for Framer Motion

import React from 'react'; // React import
import { motion } from 'framer-motion'; // Framer Motion
import { useInView } from 'framer-motion'; // Scroll trigger
import { Star, Quote } from 'lucide-react'; // Icons

// ================================
// Testimonials Data
// ================================
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Engineering Manager at Google',
    avatar: 'SJ', // Placeholder initials
    quote: 'ClickUp AI transformed our development workflow. The AI-driven task allocation reduced our project completion time by 40% and improved team productivity significantly.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Product Manager at Meta',
    avatar: 'MC',
    quote: 'The intelligent project planning and automated resource allocation helped us deliver complex features 2x faster. The analytics dashboard is a game-changer for our team.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Operations Director at Amazon',
    avatar: 'ER',
    quote: 'Managing cross-functional teams across multiple departments became effortless. The AI insights helped us identify bottlenecks and optimize our entire project pipeline.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'VP of Engineering at Netflix',
    avatar: 'DK',
    quote: 'The predictive analytics and automated progress tracking gave us unprecedented visibility into our development process. Our on-time delivery rate improved by 60%.',
    rating: 5,
  },
];

// ================================
// Testimonial Card Component
// ================================
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group hover:border-blue-200 hover:scale-105"
    >
      {/* Quote Icon */}
      <Quote className="h-8 w-8 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300" />

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }} />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed mb-8 italic text-lg group-hover:text-gray-800 transition-colors duration-300">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        {/* Avatar Placeholder */}
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {testimonial.avatar}
        </div>
        <div>
          <div className="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors duration-300">
            {testimonial.name}
          </div>
          <div className="text-gray-500 text-sm font-medium">
            {testimonial.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ================================
// Testimonials Section
// ================================
export default function TestimonialsSection() {
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
            What Our
            <span className="text-blue-600">
              {' '}Users Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real stories from professionals who transformed their productivity with our AI-powered task management platform
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}