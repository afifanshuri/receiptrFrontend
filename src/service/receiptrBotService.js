import axiosInstance from "./axiosService";

const fetchAIResponse = async (question) => {
  const response = await axiosInstance.post("/receiptrBot/ask", {
    question,
  });
  return response.data?.response;
};

export { fetchAIResponse };
