// Shopping cart page with quantity controls and checkout

import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, setCurrentPage, user } = useApp();

  // Food images mapping (same as MenuPage)
  const foodImages: { [key: string]: string } = {
    'm1': 'https://images.unsplash.com/photo-1664309641932-0e03e0771b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmb29kfGVufDF8fHx8MTc2OTU5Njg4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    'm2': 'https://images.unsplash.com/photo-1631347155591-c162abe23014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMGZvb2R8ZW58MXx8fHwxNzY5NjE1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'm3': 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=400',
    'm4': 'https://images.unsplash.com/photo-1619810816144-223f5b027aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2VidXJnZXIlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc2OTYxNDU2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    'm5': 'https://images.unsplash.com/photo-1690749127581-c9351d7d0abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYnVyZ2VyJTIwZm9vZHxlbnwxfHx8fDE3Njk1MzUyNDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'm6': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400',
    'm7': 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpZm9ybmlhJTIwc3VzaGklMjByb2xsfGVufDF8fHx8MTc2OTQ5NTEyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    'm8': 'https://images.unsplash.com/photo-1680675228874-9b9963812b7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBuaWdpcmklMjBzdXNoaXxlbnwxfHx8fDE3Njk1OTQ3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'm9': 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400',
    'm10': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2ElMjBtYXNhbGF8ZW58MXx8fHwxNzY5NTk2ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'm11': 'https://images.unsplash.com/photo-1701579231378-3726490a407b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjBidXR0ZXIlMjBtYXNhbGF8ZW58MXx8fHwxNzY5NjE1MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'm12': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    'm13': 'https://images.unsplash.com/photo-1599749012259-126a66c5f674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXR0dWNjaW5lJTIwYWxmcmVkbyUyMHBhc3RhfGVufDF8fHx8MTc2OTYxNDk2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    'm14': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    'm15': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    'm16': 'https://images.unsplash.com/photo-1599488400918-5f5f96b3f463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwdGFjb3MlMjBtZXhpY2FufGVufDF8fHx8MTc2OTU5MzgxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    'm17': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    'm18': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400',
  };

  const handleIncreaseQuantity = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else {
      handleRemoveItem(itemId);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to place an order');
      setCurrentPage('login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setCurrentPage('checkout');
  };

  // Calculate fees
  const deliveryFee = 49; // ₹49 delivery fee
  const taxRate = 0.05; // 5% GST
  const subtotal = cartTotal;
  const tax = subtotal * taxRate;
  const total = subtotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-24 w-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
        <button
          onClick={() => setCurrentPage('restaurants')}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-lg opacity-90 mt-2">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-600 font-medium text-sm"
              >
                Clear Cart
              </button>
            </div>

            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={foodImages[item.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        {item.isVeg && (
                          <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                            VEG
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        className="p-1.5 bg-white rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4 text-gray-700" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        className="p-1.5 bg-white rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">₹{item.price.toFixed(0)} each</div>
                      <div className="font-bold text-lg text-orange-500">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">₹{deliveryFee.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>GST (5%)</span>
                  <span className="font-semibold">₹{tax.toFixed(0)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-orange-500">₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold text-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => setCurrentPage('restaurants')}
                className="w-full mt-3 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
