// Main App component - Food Delivery Web Application

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { RestaurantsPage } from './components/RestaurantsPage';
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { AuthPage } from './components/AuthPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { Toaster } from 'sonner';

// Router component to handle page navigation
const AppRouter: React.FC = () => {
  const { currentPage } = useApp();

  // Render the appropriate page based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'restaurants':
        return <RestaurantsPage />;
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'login':
        return <AuthPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Navbar on all pages except login and order confirmation */}
      {currentPage !== 'login' && currentPage !== 'order-confirmation' && <Navbar />}
      
      {/* Render current page */}
      {renderPage()}
    </div>
  );
};

// Main App component with context provider
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      {/* Toast notifications */}
      <Toaster position="top-right" richColors expand={false} />
    </AppProvider>
  );
}
