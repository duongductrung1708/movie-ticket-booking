import axios, { AxiosInstance } from "axios";
import constants from "../constants/constants";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: constants.url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Thêm các headers khác nếu cần thiết
  },
});

axiosInstance.interceptors.request.use();
axiosInstance.interceptors.request.use();

export default axiosInstance;

