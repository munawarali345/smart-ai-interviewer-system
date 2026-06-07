// ================================
// ClickUp Layout
// ================================
// Purpose: Layout for ClickUp system pages

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClickUp AI - Intelligent Project Management Platform",
  description: "AI-powered project management platform with intelligent task allocation, automated workflows, predictive analytics, and team collaboration tools for modern organizations.",
};

export default function ClickUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Sonner Toast - For beautiful notifications */}
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}