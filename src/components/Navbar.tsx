'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
  isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
}`}>
  <div className="max-w-7xl mx-auto px-6 py-3">
    {/* Desktop Layout */}
    <div className="hidden md:block text-center">
      <h1 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
        isScrolled ? 'text-gray-800' : 'text-white'
      }`}>
        DimasKuliner
      </h1>
      <div className="flex justify-center space-x-10">
        {[
          { href: '/', label: 'Home' },
          { href: '/produk', label: 'Produk' },
          { href: '/lokasi', label: 'Lokasi' }
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xl font-bold py-2 px-4 rounded transition-all duration-300 hover:scale-105 ${
              isScrolled 
                ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                : 'text-white hover:text-green-200 hover:bg-white/10'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>


          {/* Mobile Layout */}
          <div className="md:hidden flex justify-between items-center">
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              isScrolled ? 'text-gray-800' : 'text-white'
            }`}>
              DimasKuliner
            </h1>
            
            <button
              onClick={toggleMobileMenu}
              className={`p-3 rounded-lg transition-all duration-300 focus:outline-none ${
                isScrolled 
                  ? 'text-gray-800 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-6 h-0.5 transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
                <span className={`block w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
                <span className={`block w-6 h-0.5 mt-1.5 transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                } ${isScrolled ? 'bg-gray-800' : 'bg-white'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col justify-center items-center px-8">
          {/* Logo */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">DimasKuliner</h1>
            <div className="w-20 h-1 bg-green-600 mx-auto rounded-full"></div>
          </div>

          {/* Menu Items */}
          <div className="space-y-8 w-full max-w-sm">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-2xl font-semibold text-gray-800 py-4 px-6 rounded-xl transition-all duration-300 hover:bg-green-50 hover:text-green-600 border-2 border-transparent hover:border-green-200"
            >
              Home
            </Link>
            <Link 
              href="/produk" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-2xl font-semibold text-gray-800 py-4 px-6 rounded-xl transition-all duration-300 hover:bg-green-50 hover:text-green-600 border-2 border-transparent hover:border-green-200"
            >
              Produk
            </Link>
            <Link 
              href="/lokasi" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center text-2xl font-semibold text-gray-800 py-4 px-6 rounded-xl transition-all duration-300 hover:bg-green-50 hover:text-green-600 border-2 border-transparent hover:border-green-200"
            >
              Lokasi
            </Link>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-3 text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-300"
            aria-label="Close menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className="block w-6 h-0.5 bg-gray-800 rotate-45 translate-y-1.5"></span>
              <span className="block w-6 h-0.5 bg-gray-800 -rotate-45 -translate-y-1.5"></span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}