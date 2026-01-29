// Dynamic Pricing Service using GROQ AI

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DishPricing {
  id: string;
  name: string;
  originalPrice: number;
  dynamicPrice: number;
  multiplier: number;
  priceChange: string;
  surcharge: number;
  savings: number;
}

export interface PricingFactors {
  weather_impact: number;
  traffic_impact: number;
  time_impact: number;
  demand_impact: number;
}

export interface WeatherInfo {
  condition: string;
  temperature: number;
  description: string;
  humidity: number;
}

export interface TimeFactors {
  hour: number;
  time_of_day: string;
  day_type: string;
  traffic: string;
  traffic_description: string;
}

export interface DynamicPricingResult {
  success: boolean;
  data?: {
    multiplier: number;
    reasoning: string;
    dishes: DishPricing[];
    factors: PricingFactors;
    conditions_summary: string;
    weather: WeatherInfo;
    time_factors: TimeFactors;
    timestamp: string;
  };
  error?: string;
}

export const fetchDynamicPricing = async (
  dishes: Array<{ id: string; name: string; price: number; category?: string }>,
  latitude: number,
  longitude: number
): Promise<DynamicPricingResult> => {
  try {
    const response = await fetch(`${API_URL}/pricing/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dishes,
        latitude,
        longitude,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to calculate dynamic pricing',
      };
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Dynamic pricing error:', error);
    return {
      success: false,
      error: error.message || 'Network error while calculating prices',
    };
  }
};

export const checkPricingServiceHealth = async (): Promise<{
  available: boolean;
  status?: string;
  message?: string;
}> => {
  try {
    const response = await fetch(`${API_URL}/pricing/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        available: false,
        message: 'Pricing service is not responding',
      };
    }

    const data = await response.json();
    return {
      available: data.status === 'ok',
      status: data.status,
      message: data.message,
    };
  } catch (error) {
    return {
      available: false,
      message: 'Cannot connect to pricing service',
    };
  }
};

// Format price change for display
export const formatPriceChange = (priceChange: string): {
  text: string;
  color: string;
  icon: string;
} => {
  const isIncrease = priceChange.startsWith('+');
  const isDecrease = priceChange.startsWith('-');

  if (isIncrease) {
    return {
      text: priceChange,
      color: 'text-orange-600',
      icon: '↑',
    };
  } else if (isDecrease) {
    return {
      text: priceChange.replace('-', ''),
      color: 'text-green-600',
      icon: '↓',
    };
  }

  return {
    text: '₹0',
    color: 'text-gray-600',
    icon: '→',
  };
};

// Get condition badge
export const getConditionBadge = (weather: WeatherInfo, traffic: string): {
  text: string;
  color: string;
  emoji: string;
} => {
  if (weather.condition === 'rain' || weather.condition === 'storm') {
    return {
      text: 'Rainy Weather',
      color: 'bg-blue-100 text-blue-800',
      emoji: '🌧️',
    };
  }

  if (traffic === 'high') {
    return {
      text: 'High Traffic',
      color: 'bg-red-100 text-red-800',
      emoji: '🚗',
    };
  }

  if (traffic === 'medium') {
    return {
      text: 'Moderate Traffic',
      color: 'bg-yellow-100 text-yellow-800',
      emoji: '🚙',
    };
  }

  return {
    text: 'Good Conditions',
    color: 'bg-green-100 text-green-800',
    emoji: '✨',
  };
};
