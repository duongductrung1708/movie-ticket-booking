// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    localStorage.setItem('user', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to verify email
export const verifyEmail = async (token) => {
  try {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to log out a user
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem('user');
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to update user information
export const updateUser = async (userId, updatedData) => {
  try {
    const token = localStorage.getItem('user');
    if (!token) throw new Error("Token not found!");

    const response = await api.put(`/users/${userId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// Function to get user details by user ID
export const getUser = async (userId) => {
  try {
    const token = localStorage.getItem('user');
    if (!token) throw new Error("Token not found!");

    const response = await api.get(`/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// You can add more API functions as needed
