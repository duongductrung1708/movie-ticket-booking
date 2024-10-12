import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getUsers = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_USER_001, {
        params: {
            ...params
        }
    });
};

export const createUser = async (userData: any) => {
    return await axiosInstance.post(API_CODE.API_USER_001, userData);
};

export const updateUser = async (id: string | undefined, userData: any) => {
    return await axiosInstance.put(`${API_CODE.API_USER_001}/${id}`, userData);
};

export const deleteUser = async (id: string) => {
    return await axiosInstance.delete(`${API_CODE.API_USER_001}/${id}`);
};
