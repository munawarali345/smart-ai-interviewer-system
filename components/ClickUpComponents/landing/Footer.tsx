// ================================
// Footer Component
// ================================
// Purpose: Site footer with navigation links and social icons

import React from 'react'; // React import
import { Bot, Github, Twitter, Linkedin, Mail } from 'lucide-react'; // Icons

// ================================
// Footer Links Data
// ================================
const footerLinks = {
  product: [
    { name: 'Features', href: '#' },
    { name: 'Pricing', href: '#' },
    { name: 'API', href: '#' },
    { name: 'Documentation', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Community', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ],
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

// ================================
// Footer Section Component
// ================================
function FooterSection({ title, links }: { title: string; links: typeof footerLinks.product }) {

  return (
    <div>
      <h3 className="text-white font-bold mb-6 text-lg">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-gray-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ================================
// Footer Component
// ================================
export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <Bot className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                ClickUp AI
              </span>
            </div>
            <p className="text-gray-300 mb-8 max-w-sm leading-relaxed">
              Transform your project management with AI-powered task optimization and intelligent workflow automation.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <FooterSection title="Product" links={footerLinks.product} />
          <FooterSection title="Company" links={footerLinks.company} />
          <FooterSection title="Support" links={footerLinks.support} />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ClickUp AI. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Powered by Groq AI
          </p>
        </div>
      </div>
    </footer>
  );
}