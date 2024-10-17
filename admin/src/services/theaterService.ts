import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getTheaters = async () => {
  return await axiosInstance.get(API_CODE.API_THEATER_001);
};
