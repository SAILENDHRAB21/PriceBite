// Geoapify API service for fetching nearby restaurants

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || '11cf02c4765349d29ad73ab51ee6c44d';

export interface GeoapifyPlace {
  properties: {
    place_id: string;
    name: string;
    street?: string;
    city?: string;
    country?: string;
    postcode?: string;
    lat: number;
    lon: number;
    categories: string[];
    datasource?: {
      raw?: {
        cuisine?: string;
        phone?: string;
        website?: string;
      };
    };
  };
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

// Get user's current location using browser geolocation API
export const getUserLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Fetch nearby restaurants using Geoapify Places API
export const getNearbyRestaurants = async (
  latitude: number,
  longitude: number,
  radius: number = 15000 // 5km radius
): Promise<GeoapifyPlace[]> => {
  try {
    const categories = 'catering.restaurant,catering.fast_food,catering.cafe';
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${longitude},${latitude},${radius}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Geoapify API error: ${response.status}`);
    }

    const data = await response.json();
    return data.features || [];
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    throw error;
  }
};

// Get fallback image based on category/cuisine
export const getRestaurantFallbackImage = (category: string): string => {
  const categoryLower = category.toLowerCase();
  
  // Map categories to appropriate food images
  if (categoryLower.includes('pizza') || categoryLower.includes('italian')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400';
  } else if (categoryLower.includes('burger') || categoryLower.includes('fast')) {
    return 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400';
  } else if (categoryLower.includes('sushi') || categoryLower.includes('japanese')) {
    return 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400';
  } else if (categoryLower.includes('indian') || categoryLower.includes('curry')) {
    return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400';
  } else if (categoryLower.includes('chinese') || categoryLower.includes('asian')) {
    return 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400';
  } else if (categoryLower.includes('mexican') || categoryLower.includes('taco')) {
    return 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400';
  } else if (categoryLower.includes('cafe') || categoryLower.includes('coffee')) {
    return 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
  } else if (categoryLower.includes('dessert') || categoryLower.includes('bakery')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400';
  } else {
    return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400';
  }
};

// Convert Geoapify place to our Restaurant format
export const convertToRestaurant = (place: GeoapifyPlace, index: number) => {
  const categories = place.properties.categories || [];
  const cuisine = place.properties.datasource?.raw?.cuisine || '';
  
  // Determine category based on Geoapify categories
  let category = 'Restaurant';
  if (categories.includes('catering.fast_food')) {
    category = 'Fast Food';
  } else if (categories.includes('catering.cafe')) {
    category = 'Cafe';
  } else if (cuisine) {
    category = cuisine.split(';')[0].split(',')[0].trim();
  }

  // Generate estimated delivery time (15-45 min)
  const deliveryMin = 15 + Math.floor(Math.random() * 15);
  const deliveryMax = deliveryMin + 10;
  const deliveryTime = `${deliveryMin}-${deliveryMax} min`;

  // Generate rating (3.5 - 4.9)
  const rating = Number((3.5 + Math.random() * 1.4).toFixed(1));

  return {
    id: place.properties.place_id || `place-${index}`,
    name: place.properties.name || 'Restaurant',
    image: getRestaurantFallbackImage(category),
    rating,
    deliveryTime,
    category,
    description: `${place.properties.street || ''}, ${place.properties.city || ''}`.trim() || 'Local restaurant',
    latitude: place.properties.lat,
    longitude: place.properties.lon,
  };
};
