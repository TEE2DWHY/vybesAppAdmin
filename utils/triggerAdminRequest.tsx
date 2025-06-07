import { createAdminInstance } from "@/config/axios";
import { cookie } from "./storage";

const token = cookie.getCookie("token");
const adminInstance = createAdminInstance(token);

export const deleteItem = async (endpoint: string, id: string) => {
  try {
    const response = await adminInstance.delete(`${endpoint}/${id}`);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};
