"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { cookie } from "@/utils/storage";
import { message } from "antd";

const Footer = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      <footer className="absolute bottom-4 right-8">
        <button
          className="bg-purple-700 px-4 py-2 rounded-full text-white hover:bg-purple-500 font-bold"
          onClick={() => {
            cookie.removeCookie("token");
            messageApi.loading(
              <div className="font-[outfit]">Logging out...</div>
            );
            router.push("/");
          }}
        >
          Logout
        </button>
      </footer>
    </>
  );
};

export default Footer;
