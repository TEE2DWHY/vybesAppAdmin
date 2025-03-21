"use client";
import { authInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import { SparklesCore } from "./dashboard/components/ui/sparkles";

interface FormData {
  email: string;
  password: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState<FormData>({
    email: "admin@vybesapp.com",
    password: "",
  });

  // useEffect(() => {
  //   const token = cookie.getCookie("token");
  //   if (token) {
  //     router.replace("/dashboard");
  //   }
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    messageApi.loading(<div className="font-[outfit]">Logging in..</div>);

    try {
      const response = await authInstance.post("/login", formData);
      messageApi.success(
        <div className="font-[outfit]">{response.data?.message}</div>
      );
      cookie.storeCookie("token", response.data?.payload?.token, "");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        messageApi.error(
          <div className="font-[outfit]">{error?.response?.data?.message}</div>
        );
      } else {
        messageApi.error(
          <div className="font-[outfit]">An unexpected error occurred.</div>
        );
      }
    }
  };

  return (
    <>
      {contextHolder}
      <div className="bg-gradient-to-r from-purple-300 to-white">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={40}
          height={40}
          className="absolute top-8 left-8 cursor-pointer"
          priority
        />
        <div className="flex flex-col items-center justify-center h-screen capitalize text-2xl">
          <Image
            src="/images/lock.gif"
            alt="lock-img"
            width={60}
            height={60}
            className="absolute bottom-10 right-5"
            priority
            unoptimized
          />
          <h1 className="font-semibold mb-4 text-3xl uppercase text-center">
            Admin Dashboard.
          </h1>
          <form
            className="bg-white rounded-xl py-5 px-3 gap-2 flex flex-col w-[90%] sm:w-[55%] lg:w-[35%] shadow-lg"
            onSubmit={handleLogin}
          >
            <h2 className="text-black text-center text-2xl">
              Welcome Back, Admin.
            </h2>
            <p className="capitalize text-base text-gray-400 text-center w-3/5 self-center">
              Enter your details to sign in to your account.
            </p>
            <div className="w-full flex flex-col p-5">
              <label className="text-base">Email</label>
              <input
                type="email"
                className="border border-gray-300 px-4 py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black mb-2"
                placeholder="email"
                required
                value={formData.email}
                name="email"
                onChange={handleChange}
                readOnly
              />
              <label className="text-base">Password</label>
              <input
                type="password"
                className="border border-gray-300 px-4 py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black"
                placeholder="password"
                required
                value={formData.password}
                name="password"
                onChange={handleChange}
              />
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-purple-500"
                    defaultChecked
                  />
                  <span>Remember Me</span>
                </span>
                <span className="text-sm">Forgot Password?</span>
              </div>
            </div>
            <button className="bg-purple-500 w-[35%] text-base rounded-3xl p-2 text-white self-center">
              Login
            </button>
            <p className="text-sm text-center my-4 capitalize">
              Admin no get account keh?{" "}
              <Link href="/register">
                <span className="font-bold underline text-purple-500 cursor-pointer">
                  Sha SignUp
                </span>
              </Link>
            </p>
          </form>
          <div className="w-[40rem] h-40 relative flex items-center justify-center">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full self-center"
              particleColor="#a855f7"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
