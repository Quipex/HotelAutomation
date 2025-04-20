import axios from 'axios';
import { logger } from '../utils/logger';

// Define types for API responses
interface HealthResponse {
  status: string;
  service: string;
}

export function apiClient(baseUrl: string) {
  // Create axios instance with base URL
  const client = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
  });

  // Add request interceptor for logging
  client.interceptors.request.use((config) => {
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  });

  // Add response interceptor for logging
  client.interceptors.response.use(
    (response) => {
      logger.debug(`API Response: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => {
      logger.error('API Error:', error.message);
      return Promise.reject(error);
    }
  );

  // Return an object with API methods
  return {
    async checkHealth(): Promise<HealthResponse> {
      const response = await client.get<HealthResponse>('/health');
      return response.data;
    },
  };
} 