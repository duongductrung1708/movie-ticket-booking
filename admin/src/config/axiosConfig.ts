import axios, { AxiosInstance } from "axios";
import constants from "../constants/constants";

const headers: { [key: string]: string } = {
  "x-locale": "en",
};

const user = localStorage.getItem('user');
const token = user ? JSON.parse(user).accessToken : null;
// fixed for waiting login pages
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MDlmMTczN2UzZDY0OWU0ZTJhYjllMyIsIm5hbWUiOiJhZG1pbjIiLCJlbWFpbCI6InRvbWFzYTgyQGV4YW1wbGUub3JnIiwiaXNWZXJpZmllZCI6dHJ1ZSwiZGF0ZSI6IjIwMjQtMTAtMTJUMDM6NDg6MDMuOTI5WiIsImJpcnRoZGF0ZSI6IjIwMjQtMTAtMTJUMDA6MDA6MDAuMDAwWiIsInBob25lIjoiMDM1OTYwMTAwMiIsInJvbGUiOiI2NmZmZThkYjBmZmZlZGNhYzhhNTU2MTgiLCJpYXQiOjE3Mjg4MzE2MDIsImV4cCI6MTcyODgzNTIwMn0.YEHS1yp1fpT3ymFrwk0PQY2esreZb0i66jVlyqmjqHs";

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
