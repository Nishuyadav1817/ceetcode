const baseURL = process.env.PARCEL_API_URL || "https://ceetcode-cyan.vercel.app";

console.log("API URL:", baseURL);

import axios from "axios";

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

export default axiosClient;





