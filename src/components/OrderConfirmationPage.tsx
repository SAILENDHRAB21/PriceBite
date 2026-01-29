// Order confirmation page with order tracking

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { orderStorage, Order } from '../utils/localStorage';
import { CheckCircle, Package, Truck, Home, Clock } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load order from localStorage
    const savedOrder = orderStorage.get();
    if (savedOrder) {
      setOrder(savedOrder);
      // Simulate order status progression
      simulateOrderProgress(savedOrder);
    } else {
      // No order found, redirect to home
      setCurrentPage('home');
    }
  }, []);

  const simulateOrderProgress = (currentOrder: Order) => {
    // Update status after delays to simulate real order tracking
    setTimeout(() => {
      const updatedOrder = { ...currentOrder, status: 'Preparing' as const };
      setOrder(updatedOrder);
      orderStorage.set(updatedOrder);
    }, 3000);

    setTimeout(() => {
      const updatedOrder = { ...currentOrder, status: 'Out for Delivery' as const };
      setOrder(updatedOrder);
      orderStorage.set(updatedOrder);
    }, 6000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const getStatusStep = (status: Order['status']): number => {
    switch (status) {
      case 'Placed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { id: 1, label: 'Order Placed', icon: CheckCircle, description: 'We received your order' },
    { id: 2, label: 'Preparing', icon: Package, description: 'Your food is being prepared' },
    { id: 3, label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way' },
    { id: 4, label: 'Delivered', icon: Home, description: 'Enjoy your meal!' }
  ];

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-xl opacity-90">Thank you for your order</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Order #{order.orderId}</h2>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4" />
                {formatDate(order.timestamp)}
              </p>
            </div>
            <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
              {order.status}
            </div>
          </div>

          {/* Order Tracking Steps */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg text-gray-800 mb-6">Order Status</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                ></div>
              </div>

              {/* Steps */}
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = step.id <= currentStep;
                  const isCurrent = step.id === currentStep;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-orange-200 scale-110' : ''}`}
                      >
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span className="text-orange-500">₹{order.total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
          >
            Back to Home
          </button>
          <button
            onClick={() => setCurrentPage('restaurants')}
            className="flex-1 py-3 border-2 border-orange-500 text-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-colors"
          >
            Order Again
          </button>
        </div>
      </div>
    </div>
  );
};
