// Restaurant listing page with search and filters

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockAPI } from '../data/mockData';
import { Restaurant } from '../data/mockData';
import { Search, Star, Clock, ChevronRight, MapPin, Navigation } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getUserLocation, getNearbyRestaurants, convertToRestaurant } from '../services/geoapifyService';
import { toast } from 'sonner';

export const RestaurantsPage: React.FC = () => {
  const { setCurrentPage, setSelectedRestaurantId } = useApp();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [useNearbyRestaurants, setUseNearbyRestaurants] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Restaurant images mapping
  const restaurantImages: { [key: string]: string } = {
    '1': 'https://images.unsplash.com/photo-1563245738-9169ff58eccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY5NTk0NTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    '2': 'https://images.unsplash.com/photo-1644447381290-85358ae625cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2OTU5NzUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    '3': 'https://images.unsplash.com/photo-1696449241254-11cf7f18ce32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY5NDk1MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    '4': 'https://images.unsplash.com/photo-1582228096960-7f5d2ec4aa8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjByZXN0YXVyYW50fGVufDF8fHx8MTc2OTYxNDk1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    '5': 'https://images.unsplash.com/photo-1662197480393-2a82030b7b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzY5NjE1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    '6': 'https://images.unsplash.com/photo-1665541620643-38a95ca78e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwcmVzdGF1cmFudCUyMHRhY29zfGVufDF8fHx8MTc2OTQ5NTEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  useEffect(() => {
    // Try to load nearby restaurants first, fallback to mock if fails
    loadNearbyRestaurants();
  }, []);

  useEffect(() => {
    // Filter restaurants based on search query
    if (searchQuery.trim()) {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchQuery, restaurants]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const data = await mockAPI.getRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyRestaurants = async () => {
    try {
      setLoading(true);
      setLocationError(null);
      toast.info('Getting your location...');

      // Get user location
      const location = await getUserLocation();
      setUserLocation(location);
      toast.success('Location found! Fetching nearby restaurants...');

      // Fetch nearby restaurants
      const places = await getNearbyRestaurants(location.latitude, location.longitude);
      
      if (places.length === 0) {
        toast.warning('No restaurants found nearby. Showing mock data.');
        await loadRestaurants();
        setUseNearbyRestaurants(false);
        return;
      }

      const nearbyRestaurants = places.map((place, index) => convertToRestaurant(place, index));
      setRestaurants(nearbyRestaurants);
      setFilteredRestaurants(nearbyRestaurants);
      setUseNearbyRestaurants(true);
      toast.success(`Found ${nearbyRestaurants.length} restaurants near you!`);
    } catch (error) {
      console.error('Error loading nearby restaurants:', error);
      const errorMessage = error instanceof GeolocationPositionError
        ? error.code === 1
          ? 'Location access denied. Please enable location permissions.'
          : error.code === 2
          ? 'Unable to determine your location.'
          : 'Location request timed out.'
        : 'Failed to fetch nearby restaurants.';
      
      setLocationError(errorMessage);
      toast.error(errorMessage + ' Showing mock data instead.');
      await loadRestaurants();
      setUseNearbyRestaurants(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantClick = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setCurrentPage('menu');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                {useNearbyRestaurants ? 'Nearby Restaurants' : 'All Restaurants'}
              </h1>
              <p className="text-xl opacity-90">
                {useNearbyRestaurants ? 'Restaurants near your location' : 'Discover the best food near you'}
              </p>
            </div>
            <button
              onClick={useNearbyRestaurants ? loadRestaurants : loadNearbyRestaurants}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white text-orange-500 rounded-full font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
                  Loading...
                </>
              ) : useNearbyRestaurants ? (
                <>
                  <MapPin className="h-5 w-5" />
                  Show All
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5" />
                  Find Nearby
                </>
              )}
            </button>
          </div>
          {userLocation && useNearbyRestaurants && (
            <div className="mt-4 flex items-center gap-2 text-sm opacity-90">
              <MapPin className="h-4 w-4" />
              Your location: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No restaurants found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={
                        useNearbyRestaurants && restaurant.image
                          ? restaurant.image
                          : restaurantImages[restaurant.id] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
                      }
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-sm">{restaurant.rating}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-1 text-gray-800">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{restaurant.category}</p>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-500 font-semibold">
                        <span className="text-sm">View Menu</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
