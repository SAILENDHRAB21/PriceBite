// Utility functions for localStorage operations

import { CartItem } from '../data/mockData';

// Cart operations
export const cartStorage = {
  get: (): CartItem[] => {
    try {
      const cart = localStorage.getItem('foodDeliveryCart');
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  set: (cart: CartItem[]): void => {
    try {
      localStorage.setItem('foodDeliveryCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem('foodDeliveryCart');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
};

// Auth operations
export interface User {
  email: string;
  name: string;
}

export const authStorage = {
  get: (): User | null => {
    try {
      const user = localStorage.getItem('foodDeliveryUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  },

  set: (user: User): void => {
    try {
      localStorage.setItem('foodDeliveryUser', JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem('foodDeliveryUser');
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }
};

// Order operations
export interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  status: 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  timestamp: number;
}

export const orderStorage = {
  get: (): Order | null => {
    try {
      const order = localStorage.getItem('foodDeliveryLastOrder');
      return order ? JSON.parse(order) : null;
    } catch (error) {
      console.error('Error reading order from localStorage:', error);
      return null;
    }
  },

  set: (order: Order): void => {
    try {
      localStorage.setItem('foodDeliveryLastOrder', JSON.stringify(order));
    } catch (error) {
      console.error('Error saving order to localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.removeItem('foodDeliveryLastOrder');
    } catch (error) {
      console.error('Error clearing order from localStorage:', error);
    }
  }
};
