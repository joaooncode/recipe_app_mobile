import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import Constants from "expo-constants";

// Get API URL from app config
const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error("Response error:", error.response?.status, error.message);

    // Handle specific error cases
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
