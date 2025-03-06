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

  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  });

  return instance;
};
