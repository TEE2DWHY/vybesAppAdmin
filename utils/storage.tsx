import Cookies from "js-cookie";

export const cookie = {
  storeCookie: (name: any, value: any, expiresIn: any) => {
    Cookies.set(name, value, { expires: expiresIn, secure: true });
  },
  getCookie: (name: any) => {
    const value = Cookies.get(name);
    return value;
  },
  removeCookie: (name: any) => {
    Cookies.remove(name);
  },
};
