// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

export const getBookingHistory = async (userId) => {
  try {
    const response = await api.get("/bookings/user/" + userId);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get("/bookings/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteBookings = async (req) => {
  try {
    const id = req.params.id;
    const response = await api.delete(`/bookings/${id}`);
    console.log("Response from delete:", response);
    if (response.status === 204) {
      console.log("Booking deleted successfully");
      return true;
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const updateBookings = async (id, updatedBooking) => {
  try {
    const response = await api.put(`/bookings/${id}`, updatedBooking);
    console.log("Response from update:", response);
    if (response.status === 200) {
      console.log("Booking updated successfully");
      return response.data;
    }
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw error;
  }
};