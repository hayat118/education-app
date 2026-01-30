import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS, ApiResponse, AuthResponse, User } from './apiConfig';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

class AuthService {
  private async getHeaders(includeAuth: boolean = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_REGISTER}`, {
        method: 'POST',
        headers: await this.getHeaders(false),
        body: JSON.stringify({ email, password, fullName }),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      await AsyncStorage.setItem(TOKEN_KEY, data.data!.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.data!.user));

      return data.data!;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
        method: 'POST',
        headers: await this.getHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse<AuthResponse> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      await AsyncStorage.setItem(TOKEN_KEY, data.data!.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.data!.user));

      return data.data!;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  }

  async getProfile(): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH_PROFILE}`, {
        method: 'GET',
        headers: await this.getHeaders(true),
      });

      const data: ApiResponse<User> = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.data!;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<void> {
    // In a real app, you'd implement token refresh logic here
    // For now, we'll just verify the current token is still valid
    try {
      await this.getProfile();
    } catch (error) {
      // Token invalid, clear storage
      await this.logout();
      throw error;
    }
  }
}

export default new AuthService();