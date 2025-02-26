import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const authInstance = axios.create({
  baseURL: `${BASE_URL}/admin/auth`,
  headers: {
    Accept: "application/json",
  },
});

export const createAdminInstance = (token: string) => {
  return axios.create({
    baseURL: `${BASE_URL}/admin`,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
};
