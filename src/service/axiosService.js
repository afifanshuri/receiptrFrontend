import axios from "axios";
import store from "../redux/store";
import { refreshAccessToken } from "./authService";
import API_URL from "../constants/constants";
import {
  setUserAuthenticated,
  setUserNotAuthenticated,
} from "../redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const token = await refreshAccessToken();
      if (token !== null) {
        store.dispatch(setUserAuthenticated(token));
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } else {
        store.dispatch(setUserNotAuthenticated());
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
