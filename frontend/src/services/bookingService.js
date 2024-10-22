// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
});

export const getBookingHistory = async (userId) => {
    try {
        const response = await api.get("/bookings/user/" + userId);
        return response.data
    } catch (error) {
        console.error(error);
    }
}