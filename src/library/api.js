import axios from "axios";
import { baseUrl } from "./constant";
import { getToken } from "./helper";

// Create an Axios instance with common headers
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request using axios interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// GET Method
export const getMethod = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error in GET request:", error);
    return { error: "An error occurred during GET request." };
  }
};

// POST Method
export const postMethod = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error in POST request:", error);
    return { error: "An error occurred during POST request." };
  }
};

// PUT Method
export const putMethod = async (url, data) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error in PUT request:", error);
    return { error: "An error occurred during PUT request." };
  }
};

// DELETE Method
export const deleteMethod = async (url, data) => {
  try {
    const response = await axiosInstance.delete(url, { data });
    return response.data; // Return only the data
  } catch (error) {
    console.error("Error in DELETE request:", error);
    return { error: "An error occurred during DELETE request." };
  }
};
