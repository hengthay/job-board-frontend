import axios from "axios";

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

export { API_BASE_URL, axiosInstance };