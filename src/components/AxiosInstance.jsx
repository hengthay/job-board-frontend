import axios from "axios";
import { isTokenExpired } from "./Helper/tokenExpiredChecker";
import { forceLogout } from "../feature/auth/authSlice";
const API = "http://127.0.0.1:8000";

const API_BASE_URL = `${API}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json',
  }
});
// Check every API request in Axios Interceptor
axiosInstance.interceptors.request.use((config) => {
  // Get user data from storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  // Get token
  const token = userData?.access_token;

  // If token received and it expired, then remove from localStorage and redirect user to login page
  if(token && isTokenExpired(token)) {
    localStorage.removeItem('userData'); // remove from localStorage
    // 👇 Import store lazily to avoid circular dependency
    import('../app/store').then(({ default: store }) => {
      store.dispatch(forceLogout());
    });
    window.location.href = '/login'; // redirect to login page
    return Promise.reject(new Error('Token expired')); // throw error
  }
  // If token not expires and receive
  if(token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }

  return config;
})

export { API_BASE_URL, axiosInstance };