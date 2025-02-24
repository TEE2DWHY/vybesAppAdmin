import axios from "axios";
import { cookie } from "@/utils/storage";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const token = cookie.getCookie("token");

export const authInstance = axios.create({
  baseURL: `${BASE_URL}/admin/auth`,
  headers: {
    Accept: "application/json",
  },
});

export const adminInstance = axios.create({
  baseURL: `${BASE_URL}/admin`,
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
});
