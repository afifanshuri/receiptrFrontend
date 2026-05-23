import axios from "axios";
import axiosInstance from "./axiosService";
import store from "../redux/store";
import { setUserNotAuthenticated } from "../redux/slices/userSlice";
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      {},
      { withCredentials: true },
    );
    return response.data.token;
  } catch (error) {
    console.error(
      "Your session encountered some error. Please log in again",
      error,
    );
    store.dispatch(setUserNotAuthenticated);
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    return null;
  }
};

const onHandleLogOut = async () => {
  const response = await axiosInstance.post(
    "/auth/logout",
    {},
    { withCredentials: true },
  );
  return response.status;
};

export { refreshAccessToken, onHandleLogOut };
