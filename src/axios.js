import axios from "axios";

export const apiUrl = "http://localhost:8000/api";

let axiosInstance = axios.create({
  baseURL: apiUrl
});

export function updateAxiosToken(token) {
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;