import axios from "axios";
import axiosInstance from "./axiosService";

const fetchStatistics = async () => {
  const response = await axiosInstance.get(`/statistics/view`);
  console.log("Fetched statistics data: ", response.data);
  return response.data;
};

export { fetchStatistics };
