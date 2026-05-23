import axiosInstance from "./axiosService";

const saveReceipt = async (receipt) => {
  if (receipt != null) {
    const response = await axiosInstance.post("/receipt/save", receipt);
    return response.status;
  }
};

const addUploadedReceipt = async (formData) => {
  const response = await axiosInstance.post("/receipt/addUpload", formData);
  console.log(response.data);
  return response.data;
};

const addUploadedReceipt64 = async (imageData) => {
  const response = await axiosInstance.post("/receipt/addUpload64", {
    imageData,
  });
  return response.data;
};

const fetchReceiptById = async (id) => {
  const response = await axiosInstance.get(`/receipt/view/${id}`);
  return response.data;
};

const fetchReceiptsByYear = async (year) => {
  const response = await axiosInstance.get("/receipt/view", {
    params: { year: year },
  });
  return response.data;
};

export {
  saveReceipt,
  addUploadedReceipt,
  addUploadedReceipt64,
  fetchReceiptById,
  fetchReceiptsByYear,
};
