'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import StepsNavigation from './StepsNavigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    // Check admin authentication status
    const checkAdminAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        setIsAdminLoggedIn(response.ok);
        return response.ok;
      } catch (error) {
        setIsAdminLoggedIn(false);
        return false;
      }
    };

    // Initial check — only start polling if admin is logged in
    checkAdminAuth().then((isAdmin) => {
      if (isAdmin) {
        interval = setInterval(checkAdminAuth, 30000);
      }
    });

    // Listen for storage events to update auth status when user logs out in another tab
    const handleStorageChange = () => {
      checkAdminAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (interval) clearInterval(interval);
    };
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/booking', label: 'Booking' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img
              src="/logo_final_wellness.png"
              alt="Wellness IV Drip Logo"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors duration-200 ${isScrolled
                  ? 'text-gray-700 hover:text-teal-500'
                  : 'text-white hover:text-teal-300'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            {isAdminLoggedIn && (
              <Link
                href="/secure-access/admin"
                className={`font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${isScrolled
                  ? 'text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'
                  : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                  }`}
              >
                Admin Dashboard
              </Link>
            )}
            <StepsNavigation />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'
                }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 ${isScrolled
                    ? 'text-gray-700 hover:text-teal-500'
                    : 'text-white hover:text-teal-300'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAdminLoggedIn && (
                <Link
                  href="/secure-access/admin"
                  className={`font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${isScrolled
                    ? 'text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 shadow-lg'
                    : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-4">
                <StepsNavigation />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
