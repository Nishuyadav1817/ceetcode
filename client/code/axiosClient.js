import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://ceetcode-omega.vercel.app",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;






