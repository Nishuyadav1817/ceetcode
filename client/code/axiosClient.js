import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://ceetcode-omega.vercel.app",
    withCredentials: false,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosClient;






