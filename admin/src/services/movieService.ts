import axiosInstance from "../config/axiosConfig"
import API_CODE from "../constants/api_code";

export const getMovies= async ()=>{
    return await axiosInstance.get(API_CODE.API_MOVIE_001);
}