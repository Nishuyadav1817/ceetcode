import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://ceetcode-omega.vercel.app",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;






