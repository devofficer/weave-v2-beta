import axios from "axios";
import { API_BASE_URL } from "config/constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
    'accept': 'application/json',
    // 'X-API-Key': process.env.NEXT_PUBLIC_MORALIS_API_KEY
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      console.log('api error', error)
      window.location.href = "/401";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;