import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const getShowtimes = async (params: object) => {
  return await axiosInstance.get(API_CODE.API_SHOWTIME_001, {
    params: {
      ...params,
    },
  });
};

//get showtime by id
export const getShowtimeById = async (id: string) => {
  return await axiosInstance.get(`${API_CODE.API_SHOWTIME_001}/${id}`);
};

export const getShowtimesByRoom = async (params: object, roomId: string) => {
  return await axiosInstance.get(
    `${API_CODE.API_SHOWTIME_001}/room/${roomId}`,
    {
      params: {
        ...params,
      },
    }
  );
};

export const getPaginatedShowtimes = async (params: object) => {
  return await axiosInstance.get(API_CODE.API_SHOWTIME_001 + "/paginated", {
    params: {
      ...params,
    },
  });
};

// Function to get showtimes by theater ID
export const getShowtimesByTheater = async (theaterId: string) => {
  try {
    const response = await axiosInstance.get(
      `/theaters/${theaterId}/showtimes`
    );
    return response.data;
  } catch (error: any) {
    console.error("Get showtimes by theater error:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const saveShowtime = async (showtimeData: object) => {
  return await axiosInstance.post(API_CODE.API_SHOWTIME_001, showtimeData);
};

export const deleteShowtime = async (showtimeId: string) => {
  return await axiosInstance.delete(
    `${API_CODE.API_SHOWTIME_001}/${showtimeId}`
  );
};

export const updateShowtime = async (showtimeId: string, data: object) => {
  return await axiosInstance.put(API_CODE.API_SHOWTIME_001 + "/" + showtimeId, {
    ...data,
  });
};
