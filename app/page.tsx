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
      cookie.storeCookie("token", response.data?.payload?.accessToken, "");
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
      <div className="min-h-screen bg-gradient-to-r from-purple-300 to-white relative overflow-hidden">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={40}
          height={40}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 cursor-pointer z-10"
          priority
        />

        <Image
          src="/images/lock.gif"
          alt="lock-img"
          width={60}
          height={60}
          className="absolute bottom-4 right-2 sm:bottom-10 sm:right-5 hidden xs:block"
          priority
          unoptimized
        />

        <div className="flex flex-col items-center justify-center min-h-screen px-4 mt-[5%] sm:px-6 lg:px-8">
          <h1 className="font-semibold mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl uppercase text-center leading-tight">
            Admin Dashboard.
          </h1>

          <form
            className="bg-white rounded-xl py-6 px-4 sm:py-8 sm:px-6 gap-2 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg"
            onSubmit={handleLogin}
          >
            <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-medium">
              Welcome Back, Admin.
            </h2>
            <p className="capitalize text-sm sm:text-base text-gray-400 text-center max-w-xs mx-auto leading-relaxed">
              Enter your details to sign in to your account.
            </p>

            <div className="w-full flex flex-col p-3 sm:p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  readOnly
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />
              </div>

              {/* Remember me and forgot password */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 sm:mt-6">
                <label className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-500 w-4 h-4"
                    defaultChecked
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-purple-500 hover:text-purple-600 transition-colors text-left sm:text-right"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 w-full sm:w-2/3 md:w-1/2 text-sm sm:text-base rounded-3xl py-2.5 sm:py-3 text-white self-center transition-colors font-medium"
            >
              Login
            </button>

            <p className="text-xs sm:text-sm text-center my-4 capitalize px-2">
              Admin no get account keh?{" "}
              <Link href="/register">
                <span className="font-bold underline text-purple-500 cursor-pointer hover:text-purple-600 transition-colors">
                  Sha SignUp
                </span>
              </Link>
            </p>
          </form>

          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl h-20 sm:h-32 md:h-40 relative flex items-center justify-center mt-4 sm:mt-8">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={800}
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
