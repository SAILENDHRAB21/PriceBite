// Menu page showing food items for a selected restaurant

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockAPI } from '../data/mockData';
import { Restaurant, MenuItem } from '../data/mockData';
import { ArrowLeft, Star, Clock, Plus, Minus, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

export const MenuPage: React.FC = () => {
  const { setCurrentPage, selectedRestaurantId, addToCart, cart } = useApp();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Food images mapping
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

  useEffect(() => {
    if (selectedRestaurantId) {
      loadMenuData();
    } else {
      // If no restaurant selected, go back to restaurants page
      setCurrentPage('restaurants');
    }
  }, [selectedRestaurantId]);

  const loadMenuData = async () => {
    if (!selectedRestaurantId) return;

    try {
      setLoading(true);
      const [restaurantData, menuData] = await Promise.all([
        mockAPI.getRestaurantById(selectedRestaurantId),
        mockAPI.getMenuByRestaurantId(selectedRestaurantId)
      ]);
      setRestaurant(restaurantData);
      setMenuItems(menuData);
    } catch (error) {
      console.error('Error loading menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };

  const getItemQuantityInCart = (itemId: string): number => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <p className="text-xl text-gray-600 mb-4">Restaurant not found</p>
        <button
          onClick={() => setCurrentPage('restaurants')}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => setCurrentPage('restaurants')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-4 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Restaurants
          </button>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-3">{restaurant.category}</p>
              <p className="text-gray-500 mb-4">{restaurant.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{restaurant.rating}</span>
                  <span className="text-gray-500 text-sm">Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold">{restaurant.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const quantityInCart = getItemQuantityInCart(item.id);
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={foodImages[item.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {item.isVeg && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        VEG
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                    {quantityInCart > 0 && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-600 font-semibold">
                        <ShoppingCart className="h-4 w-4" />
                        {quantityInCart} in cart
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
