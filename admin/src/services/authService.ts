import axiosInstance from "../config/axiosConfig";
import API_CODE from "../constants/api_code";

export const handleLogin = async (loginForm: LoginForm): Promise<AuthData> => {
  const response = await axiosInstance.post<AuthData>(API_CODE.API_AUTH_001, loginForm);
  return response.data;
};
