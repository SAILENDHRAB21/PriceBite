// Global application context for state management

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem } from '../data/mockData';
import { cartStorage, authStorage, User } from '../utils/localStorage';
import { authService } from '../services/authService';

interface AppContextType {
  // Cart state
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Auth state
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Location state
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;

  // Navigation state
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Auth state
  const [user, setUser] = useState<User | null>(null);

  // Location state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // Load cart and user from localStorage on mount
  useEffect(() => {
    const savedCart = cartStorage.get();
    const savedUser = authStorage.get();
    
    if (savedCart.length > 0) {
      setCart(savedCart);
    }
    
    if (savedUser) {
      setUser(savedUser);
      setCurrentPage('home'); // Go to home if user is already logged in
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    cartStorage.set(cart);
  }, [cart]);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    cartStorage.clear();
  };

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Auth operations
  const login = (userData: User) => {
    setUser(userData);
    authStorage.set(userData);
  };

  const logout = () => {
    setUser(null);
    authStorage.clear();
    authService.logout(); // Clear JWT token
    setCurrentPage('login'); // Redirect to login page
  };

  const value: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    user,
    login,
    logout,
    userLocation,
    setUserLocation,
    currentPage,
    setCurrentPage,
    selectedRestaurantId,
    setSelectedRestaurantId
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
