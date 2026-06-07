// ================================
// ClickUp Landing Page
// ================================
// Purpose: Premium landing page for ClickUp system with all sections

import React from 'react'; // React import

// Landing page components
import Header from '@/components/ClickUpComponents/landing/Header';
import HeroSection from '@/components/ClickUpComponents/landing/HeroSection';
import FeaturesSection from '@/components/ClickUpComponents/landing/FeaturesSection';
import WorkflowSection from '@/components/ClickUpComponents/landing/WorkflowSection';
import StatsSection from '@/components/ClickUpComponents/landing/StatsSection';
import TestimonialsSection from '@/components/ClickUpComponents/landing/TestimonialsSection';
import CTASection from '@/components/ClickUpComponents/landing/CTASection';
import Footer from '@/components/ClickUpComponents/landing/Footer';

// ================================
// Main Page Component
// ================================
export default function ClickUpLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header - Professional navbar */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section - Main landing area */}
        <HeroSection />

        {/* Features Section - Key features showcase */}
        <FeaturesSection />

        {/* Workflow Section - How it works */}
        <WorkflowSection />

        {/* Stats Section - Trust indicators */}
        <StatsSection />

        {/* Testimonials Section - User reviews */}
        <TestimonialsSection />

        {/* CTA Section - Final call to action */}
        <CTASection />
      </main>

      {/* Footer - Site footer */}
      <Footer />
    </div>
  );
}