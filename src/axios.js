import axios from "axios";

let store;

export function injectStore(s) {
  store = s;
}

export const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

let axiosInstance = axios.create({
  baseURL: apiUrl
});

export function updateAxiosToken(accessToken) {
  axiosInstance.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
}

export function disableAxiosToken() {
  delete axiosInstance.defaults.headers["Authorization"];
}

axiosInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  const config = error.config;

  if (error.response.status === 401 && !config.refreshAttempted) {
    config.refreshAttempted = true;
    const refreshToken = store.getState().app.refreshToken;

    try {
      const response = await axios.post(`${apiUrl}/token/refresh`, {refresh: refreshToken});
      const {access} = response.data;

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${access}`
      }

      return axiosInstance(config);
    }
    catch (error) {
      store.dispatch({type: "SHOW_ERROR_NOTIFICATION", message: "Your session has expired! Please log in again."})
      store.dispatch({type: "LOGOUT", invalidateRefreshToken: false});
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
});


export default axiosInstance;