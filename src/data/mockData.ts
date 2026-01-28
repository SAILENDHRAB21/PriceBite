// Mock data for the food delivery application

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  category: string;
  description: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Pizza Paradise",
    image: "pizza-restaurant",
    rating: 4.5,
    deliveryTime: "25-30 min",
    category: "Pizza, Italian",
    description: "Authentic Italian pizzas with fresh ingredients"
  },
  {
    id: "2",
    name: "Burger House",
    image: "burger-restaurant",
    rating: 4.3,
    deliveryTime: "20-25 min",
    category: "Burgers, Fast Food",
    description: "Juicy burgers and crispy fries"
  },
  {
    id: "3",
    name: "Sushi Master",
    image: "sushi-restaurant",
    rating: 4.7,
    deliveryTime: "35-40 min",
    category: "Japanese, Sushi",
    description: "Fresh sushi and authentic Japanese cuisine"
  },
  {
    id: "4",
    name: "Tandoor Nights",
    image: "indian-restaurant",
    rating: 4.6,
    deliveryTime: "30-35 min",
    category: "Indian, Tandoor",
    description: "Spicy Indian curries and tandoori dishes"
  },
  {
    id: "5",
    name: "Pasta Point",
    image: "pasta-restaurant",
    rating: 4.4,
    deliveryTime: "25-30 min",
    category: "Italian, Pasta",
    description: "Creamy pastas and Italian delicacies"
  },
  {
    id: "6",
    name: "Taco Fiesta",
    image: "mexican-restaurant",
    rating: 4.2,
    deliveryTime: "20-25 min",
    category: "Mexican, Tacos",
    description: "Authentic Mexican tacos and burritos"
  }
];

export const menuItems: MenuItem[] = [
  // Pizza Paradise
  {
    id: "m1",
    restaurantId: "1",
    name: "Margherita Pizza",
    description: "Classic tomato sauce, mozzarella, and basil",
    price: 12.99,
    image: "margherita-pizza",
    category: "Pizza",
    isVeg: true
  },
  {
    id: "m2",
    restaurantId: "1",
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and cheese",
    price: 15.99,
    image: "pepperoni-pizza",
    category: "Pizza",
    isVeg: false
  },
  {
    id: "m3",
    restaurantId: "1",
    name: "Veggie Supreme",
    description: "Fresh vegetables and herbs on thin crust",
    price: 14.99,
    image: "veggie-pizza",
    category: "Pizza",
    isVeg: true
  },
  // Burger House
  {
    id: "m4",
    restaurantId: "2",
    name: "Classic Cheeseburger",
    description: "Beef patty with cheese, lettuce, and tomato",
    price: 9.99,
    image: "cheeseburger",
    category: "Burger",
    isVeg: false
  },
  {
    id: "m5",
    restaurantId: "2",
    name: "Chicken Burger",
    description: "Crispy chicken with mayo and pickles",
    price: 10.99,
    image: "chicken-burger",
    category: "Burger",
    isVeg: false
  },
  {
    id: "m6",
    restaurantId: "2",
    name: "Veggie Burger",
    description: "Plant-based patty with fresh veggies",
    price: 8.99,
    image: "veggie-burger",
    category: "Burger",
    isVeg: true
  },
  // Sushi Master
  {
    id: "m7",
    restaurantId: "3",
    name: "California Roll",
    description: "Crab, avocado, and cucumber",
    price: 11.99,
    image: "california-roll",
    category: "Sushi",
    isVeg: false
  },
  {
    id: "m8",
    restaurantId: "3",
    name: "Salmon Nigiri",
    description: "Fresh salmon over seasoned rice",
    price: 13.99,
    image: "salmon-sushi",
    category: "Sushi",
    isVeg: false
  },
  {
    id: "m9",
    restaurantId: "3",
    name: "Vegetable Tempura Roll",
    description: "Crispy vegetables with soy sauce",
    price: 10.99,
    image: "tempura-roll",
    category: "Sushi",
    isVeg: true
  },
  // Tandoor Nights
  {
    id: "m10",
    restaurantId: "4",
    name: "Chicken Tikka Masala",
    description: "Tender chicken in creamy tomato curry",
    price: 14.99,
    image: "chicken-tikka",
    category: "Curry",
    isVeg: false
  },
  {
    id: "m11",
    restaurantId: "4",
    name: "Paneer Butter Masala",
    description: "Cottage cheese in rich buttery gravy",
    price: 12.99,
    image: "paneer-butter",
    category: "Curry",
    isVeg: true
  },
  {
    id: "m12",
    restaurantId: "4",
    name: "Naan Bread",
    description: "Freshly baked in tandoor oven",
    price: 2.99,
    image: "naan-bread",
    category: "Bread",
    isVeg: true
  },
  // Pasta Point
  {
    id: "m13",
    restaurantId: "5",
    name: "Fettuccine Alfredo",
    description: "Creamy parmesan sauce with fettuccine",
    price: 13.99,
    image: "fettuccine-alfredo",
    category: "Pasta",
    isVeg: true
  },
  {
    id: "m14",
    restaurantId: "5",
    name: "Spaghetti Carbonara",
    description: "Eggs, cheese, and crispy bacon",
    price: 14.99,
    image: "carbonara",
    category: "Pasta",
    isVeg: false
  },
  {
    id: "m15",
    restaurantId: "5",
    name: "Penne Arrabbiata",
    description: "Spicy tomato sauce with garlic",
    price: 12.99,
    image: "penne-arrabbiata",
    category: "Pasta",
    isVeg: true
  },
  // Taco Fiesta
  {
    id: "m16",
    restaurantId: "6",
    name: "Beef Tacos",
    description: "Seasoned beef with salsa and cheese",
    price: 9.99,
    image: "beef-tacos",
    category: "Tacos",
    isVeg: false
  },
  {
    id: "m17",
    restaurantId: "6",
    name: "Chicken Burrito",
    description: "Grilled chicken, rice, beans, and guac",
    price: 11.99,
    image: "chicken-burrito",
    category: "Burrito",
    isVeg: false
  },
  {
    id: "m18",
    restaurantId: "6",
    name: "Veggie Quesadilla",
    description: "Grilled vegetables and melted cheese",
    price: 8.99,
    image: "veggie-quesadilla",
    category: "Quesadilla",
    isVeg: true
  }
];

// Popular dishes for home page (mix from different restaurants)
export const popularDishes = [
  menuItems[0], // Margherita Pizza
  menuItems[3], // Cheeseburger
  menuItems[6], // California Roll
  menuItems[9], // Chicken Tikka Masala
  menuItems[12], // Fettuccine Alfredo
  menuItems[15] // Beef Tacos
];

// Featured restaurants for home page
export const featuredRestaurants = restaurants.slice(0, 4);

// Mock API functions simulating backend calls
export const mockAPI = {
  // Simulate network delay
  delay: (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms)),

  // Get all restaurants
  getRestaurants: async (): Promise<Restaurant[]> => {
    await mockAPI.delay();
    return restaurants;
  },

  // Get restaurant by ID
  getRestaurantById: async (id: string): Promise<Restaurant | null> => {
    await mockAPI.delay();
    return restaurants.find(r => r.id === id) || null;
  },

  // Get menu items for a restaurant
  getMenuByRestaurantId: async (restaurantId: string): Promise<MenuItem[]> => {
    await mockAPI.delay();
    return menuItems.filter(item => item.restaurantId === restaurantId);
  },

  // Get popular dishes
  getPopularDishes: async (): Promise<MenuItem[]> => {
    await mockAPI.delay();
    return popularDishes;
  },

  // Get featured restaurants
  getFeaturedRestaurants: async (): Promise<Restaurant[]> => {
    await mockAPI.delay();
    return featuredRestaurants;
  },

  // Search restaurants
  searchRestaurants: async (query: string): Promise<Restaurant[]> => {
    await mockAPI.delay();
    const lowerQuery = query.toLowerCase();
    return restaurants.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) ||
      r.category.toLowerCase().includes(lowerQuery)
    );
  },

  // Search menu items
  searchMenuItems: async (query: string): Promise<MenuItem[]> => {
    await mockAPI.delay();
    const lowerQuery = query.toLowerCase();
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  },

  // Mock login
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: any }> => {
    await mockAPI.delay();
    // Simple mock validation
    if (email && password.length >= 6) {
      return {
        success: true,
        message: "Login successful",
        user: { email, name: email.split('@')[0] }
      };
    }
    return {
      success: false,
      message: "Invalid credentials"
    };
  },

  // Mock register
  register: async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    await mockAPI.delay();
    if (name && email && password.length >= 6) {
      return {
        success: true,
        message: "Registration successful"
      };
    }
    return {
      success: false,
      message: "Invalid registration details"
    };
  },

  // Mock place order
  placeOrder: async (orderData: any): Promise<{ success: boolean; orderId: string }> => {
    await mockAPI.delay(1000);
    const orderId = 'ORD' + Date.now();
    return {
      success: true,
      orderId
    };
  }
};
