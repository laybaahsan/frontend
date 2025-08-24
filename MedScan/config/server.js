import axios from "axios";
import apiConfig from "./app"; // import the base URL

const server = axios.create({
  baseURL: apiConfig.API_BASE_URL,
   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default server;

