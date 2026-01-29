// Authentication service using JWT and backend API

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface VerifyResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

// Store token in localStorage
export const authService = {
  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // Store token
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  // Remove token
  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  // Register new user
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the server is running.',
      };
    }
  },

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.token) {
        this.setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check if the server is running.',
      };
    }
  },

  // Verify token
  async verifyToken(): Promise<VerifyResponse> {
    const token = this.getToken();

    if (!token) {
      return {
        success: false,
        message: 'No token found',
      };
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: VerifyResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Network error',
      };
    }
  },

  // Logout user
  logout(): void {
    this.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Get user profile (protected route example)
  async getProfile(): Promise<any> {
    const token = this.getToken();

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      };
    }

    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        message: 'Network error',
      };
    }
  },
};
