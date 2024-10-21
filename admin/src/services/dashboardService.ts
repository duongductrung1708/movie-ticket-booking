import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getListTopMovies = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_DASHBOARD_001, {
        params: {
            ...params
        }
    });
};

export const getListTopValues = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_DASHBOARD_002, {
        params: {
            ...params
        }
    });
};

export const getLListRevenues = async (params: object) => {
    return await axiosInstance.get(API_CODE.API_DASHBOARD_003, {
        params: {
            ...params
        }
    });
};
