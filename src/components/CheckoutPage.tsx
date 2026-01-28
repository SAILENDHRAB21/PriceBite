// Checkout page to place orders

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockAPI } from '../data/mockData';
import { orderStorage, Order } from '../utils/localStorage';
import { MapPin, Phone, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart, setCurrentPage, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const deliveryFee = 4.99;
  const taxRate = 0.08;
  const subtotal = cartTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!formData.cardExpiry.trim()) {
      newErrors.cardExpiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
      newErrors.cardExpiry = 'Invalid format (MM/YY)';
    }

    if (!formData.cardCVC.trim()) {
      newErrors.cardCVC = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cardCVC)) {
      newErrors.cardCVC = 'Invalid CVC';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart,
        total,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        phone: formData.phone,
        user: user?.email
      };

      const response = await mockAPI.placeOrder(orderData);

      if (response.success) {
        // Save order to localStorage
        const order: Order = {
          orderId: response.orderId,
          items: cart,
          total,
          status: 'Placed',
          timestamp: Date.now()
        };
        orderStorage.set(order);

        // Clear cart
        clearCart();

        // Navigate to order confirmation
        toast.success('Order placed successfully!');
        setCurrentPage('order-confirmation');
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setCurrentPage('cart')}
            className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Delivery Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.address
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.city
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => {
                        setFormData({ ...formData, zipCode: e.target.value });
                        if (errors.zipCode) setErrors({ ...errors, zipCode: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.zipCode
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.phone
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Payment Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, cardNumber: e.target.value });
                      if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.cardNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-orange-500'
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={formData.cardExpiry}
                      onChange={(e) => {
                        setFormData({ ...formData, cardExpiry: e.target.value });
                        if (errors.cardExpiry) setErrors({ ...errors, cardExpiry: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.cardExpiry
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    {errors.cardExpiry && <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={formData.cardCVC}
                      onChange={(e) => {
                        setFormData({ ...formData, cardCVC: e.target.value });
                        if (errors.cardCVC) setErrors({ ...errors, cardCVC: '' });
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.cardCVC
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-orange-500'
                      }`}
                      placeholder="123"
                      maxLength={4}
                    />
                    {errors.cardCVC && <p className="mt-1 text-sm text-red-500">{errors.cardCVC}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Items ({cart.length})</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-orange-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
