import axios from "axios";
import { refreshAccessToken } from "./authService";

const fetchStatistics = async (user) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/statistics/total`,
      { headers: { Authorization: `Bearer ${user.accessToken}` } },
    );
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("ERROR");
    }
  }
};

export { fetchStatistics };
