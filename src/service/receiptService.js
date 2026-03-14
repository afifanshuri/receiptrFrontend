import axios from "axios";

const saveReceipt = async (receipt, user) => {
  if (receipt != null) {
    const response = await axios.post(
      "http://localhost:8080/api/receipt/add",
      receipt,
      { headers: { Authorization: `Bearer ${user.accessToken}` } },
    );
    return response.status;
  }
};

export { saveReceipt };
