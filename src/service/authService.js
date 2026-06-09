import axios from "axios";
import axiosInstance from "./axiosService";
import API_URL from "../constants/constants";

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    console.log("Refresh response:", response);
    return response.data.token;
  } catch (error) {
    console.error(
      "Your session encountered some error. Please log in again",
      error,
    );
    throw error;
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

const handleLogin = async (email, password) => {
  try {
    const response = await axiosInstance.post(
      "/api/auth/authenticate",
      {
        email: email,
        password: password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("There was an error logging in!", error);
    throw error;
  }
};

const handleRegister = async (email, password, fname, lname, phone) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/api/auth/register`, {
      email: email,
      password: password,
      firstName: fname,
      lastName: lname,
      phoneNumber: phone,
    });
    return response.data;
  } catch (error) {
    console.error("There was an error during registration!", error);
    throw error;
  }
};

export { refreshAccessToken, onHandleLogOut, handleLogin, handleRegister };
