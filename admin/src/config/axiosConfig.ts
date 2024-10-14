import axios, { AxiosInstance } from "axios";
import constants from "../constants/constants";

const headers: { [key: string]: string } = {
  "x-locale": "en",
};

const user = localStorage.getItem('user');
const token = user ? JSON.parse(user).accessToken : null;
// fixed for waiting login pages

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

axiosInstance.interceptors.request.use();
axiosInstance.interceptors.response.use();

export default axiosInstance;
