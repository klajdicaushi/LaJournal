import axios from "axios";

const apiUrl = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: apiUrl
});

export default axiosInstance;