// Navigation bar component with logo, menu links, and cart

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, cartCount, user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'cart', label: 'Cart' }
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (user) {
      logout();
      setCurrentPage('home');
    } else {
      setCurrentPage('login');
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-2 mr-2">
              <Search className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              FoodExpress
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-base font-medium transition-colors hover:text-orange-500 ${
                  currentPage === item.id ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Cart Icon with Badge */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className={`h-6 w-6 ${currentPage === 'cart' ? 'text-orange-500' : 'text-gray-700'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Login/Logout Button */}
            <button
              onClick={handleAuthClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg transition-shadow"
            >
              <User className="h-4 w-4" />
              <span>{user ? user.name : 'Login'}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-2 text-base font-medium ${
                  currentPage === item.id ? 'text-orange-500' : 'text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleAuthClick}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700"
            >
              {user ? `Logout (${user.name})` : 'Login'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
