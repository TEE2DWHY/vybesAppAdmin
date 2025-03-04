import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const authInstance = axios.create({
  baseURL: `${BASE_URL}/admin/auth`,
  headers: {
    Accept: "application/json",
  },
});

export const createAdminInstance = (token: string) => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/admin`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  // Add a request interceptor
  instance.interceptors.request.use((config) => {
    // Check if the data is FormData
    if (config.data instanceof FormData) {
      // Do not set Content-Type for FormData
      delete config.headers["Content-Type"];
    }
    return config;
  });

  return instance;
};
