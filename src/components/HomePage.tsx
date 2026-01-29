// Home page with hero banner, search, popular dishes, and featured restaurants

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockAPI } from '../data/mockData';
import { Restaurant, MenuItem } from '../data/mockData';
import { Search, Clock, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const HomePage: React.FC = () => {
  const { setCurrentPage, setSelectedRestaurantId, addToCart } = useApp();
  const [popularDishes, setPopularDishes] = useState<MenuItem[]>([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Image mapping for real images
  const dishImages: { [key: string]: string } = {
    'm1': 'https://images.unsplash.com/photo-1664309641932-0e03e0771b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emElMjBmb29kfGVufDF8fHx8MTc2OTU5Njg4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    'm4': 'https://images.unsplash.com/photo-1619810816144-223f5b027aea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2VidXJnZXIlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc2OTYxNDU2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    'm7': 'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxpZm9ybmlhJTIwc3VzaGklMjByb2xsfGVufDF8fHx8MTc2OTQ5NTEyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    'm10': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwdGlra2ElMjBtYXNhbGF8ZW58MXx8fHwxNzY5NTk2ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'm13': 'https://images.unsplash.com/photo-1599749012259-126a66c5f674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXR0dWNjaW5lJTIwYWxmcmVkbyUyMHBhc3RhfGVufDF8fHx8MTc2OTYxNDk2MXww&ixlib=rb-4.1.0&q=80&w=1080',
    'm16': 'https://images.unsplash.com/photo-1599488400918-5f5f96b3f463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwdGFjb3MlMjBtZXhpY2FufGVufDF8fHx8MTc2OTU5MzgxMHww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const restaurantImages: { [key: string]: string } = {
    '1': 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY5NTk0NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    '2': 'https://images.unsplash.com/photo-1644447381290-85358ae625cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2OTU5NzUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    '3': 'https://images.unsplash.com/photo-1696449241254-11cf7f18ce32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY5NDk1MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    '4': 'https://images.unsplash.com/photo-1582228096960-7f5d2ec4aa8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByZXN0YXVyYW50fGVufDF8fHx8MTc2OTYxNDk1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dishes, restaurants] = await Promise.all([
        mockAPI.getPopularDishes(),
        mockAPI.getFeaturedRestaurants()
      ]);
      setPopularDishes(dishes);
      setFeaturedRestaurants(restaurants);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      // Navigate to restaurants page with search results
      setCurrentPage('restaurants');
    }
  };

  const handleRestaurantClick = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('menu');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1548778241-6010a342d2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBoZXJvJTIwYmFubmVyfGVufDF8fHx8MTc2OTYxNDU1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Food delivery"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Delicious Food Delivered
            </h1>
            <p className="text-xl sm:text-2xl mb-8 opacity-90">
              Order from your favorite restaurants
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search aria-hidden="true" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for food or restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === 'NumpadEnter') && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  aria-label="Search"
                  className="px-8 py-4 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Dishes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-gray-800">Popular Dishes</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={dishImages[dish.id] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {dish.isVeg && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      VEG
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-gray-800">{dish.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-500">₹{dish.price.toFixed(0)}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(dish)}
                      aria-label={`Add ${dish.name} to cart`}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Featured Restaurants Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Restaurants</h2>
            <button
              onClick={() => setCurrentPage('restaurants')}
              className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              View All
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRestaurantClick(restaurant.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="relative h-40 overflow-hidden">
                    <ImageWithFallback
                      src={restaurantImages[restaurant.id] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{restaurant.category}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
