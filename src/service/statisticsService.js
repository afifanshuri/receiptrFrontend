import axiosInstance from "./axiosService";

const fetchStatistics = async () => {
  const response = await axiosInstance.get(`/statistics/view`);
  return response.data;
};

export { fetchStatistics };
