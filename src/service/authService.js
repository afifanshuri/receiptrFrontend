import axios from "axios";
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    console.log(
      "Access token refreshed!!!!!!!!!!!!!!!!!!!!!!:",
      response.data.token
    );
    return response.data.token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
};

export { refreshAccessToken };
