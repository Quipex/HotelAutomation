import axios from 'axios';
import { backendUrl } from './config';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API methods
export const api = {
  // Booking related endpoints
  get: async (endpoint: string, config = {}) => {
    return apiClient.get(endpoint, config);
  },

  post: async (endpoint: string, data: any = {}) => {
    return apiClient.post(endpoint, data);
  },

  patch: async (endpoint: string, data: any) => {
    return apiClient.patch(endpoint, data);
  },

  // Specific API endpoints
  getBooking: async (id: string) => {
    return apiClient.get(`/booking/${id}`);
  },

  searchBookings: async (params: Record<string, string>) => {
    return apiClient.get('/bookings', { params });
  },

  getAvailableRooms: async (fromDate: string, numDays: number, guests: number) => {
    return apiClient.get('/rooms/available', {
      params: { fromDate, numDays, guests }
    });
  },

  syncData: async () => {
    return apiClient.post('/sync');
  }
};

export default api;
