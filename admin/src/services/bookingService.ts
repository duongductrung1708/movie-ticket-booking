import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getBookings = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_BOOKING_001, {
        params: {
            ...params,
        },
    });
};

export const createBooking = async (bookingData: any) => {
    return await axiosInstance.post(API_CODE.API_BOOKING_001, bookingData);
};

export const cancelBooking = async (id: string | undefined) => {
    return await axiosInstance.put(`${API_CODE.API_BOOKING_001}/${id}`, {status: "canceled"});
};
