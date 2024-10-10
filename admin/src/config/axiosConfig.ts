import axios, { AxiosInstance } from "axios";
import constants from "../constants/constants";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: constants.url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use();
axiosInstance.interceptors.request.use();

export default axiosInstance;