import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode !== "production"
      ? "http://localhost:3000/api"
      : import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default axiosInstance;
