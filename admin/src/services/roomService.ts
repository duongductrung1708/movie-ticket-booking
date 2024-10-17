import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getRoomByTheaterId = async (theaterId: string) => {
  const response = await axiosInstance.get(
    `${API_CODE.API_ROOM_001}/theater/${theaterId}`
  );
  return response.data.rooms;
};
