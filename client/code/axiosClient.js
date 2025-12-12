import axios from "axios"

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:1616'
    : 'https://ceetcode-iota.vercel.app';

const axiosClient = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export default axiosClient;

