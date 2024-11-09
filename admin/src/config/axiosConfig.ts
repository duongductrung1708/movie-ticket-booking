import axios, { AxiosInstance } from "axios";
import constants from "../constants/constants";
import { useAuth } from "../context/AuthProvider";

const headers: { [key: string]: string } = {
  "x-locale": "en",
};

const user = localStorage.getItem("user");
const token = user ? JSON.parse(user).accessToken : null;

if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: constants.url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).accessToken : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
