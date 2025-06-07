"use client";
import { authInstance } from "@/config/axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const Page = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    messageApi.loading(
      <div className="font-[outfit]">Creating An Account..</div>
    );

    try {
      const response = await authInstance.post("/register", formData);
      console.log(response.data);
      messageApi.success(
        <div className="font-[outfit]">{response.data?.message}</div>
      );
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error);
        messageApi.error(
          <div className="font-[outfit]">{error?.response?.data?.message}</div>
        );
      } else {
        console.error("Unexpected error:", error);
        messageApi.error(
          <div className="font-[outfit]">An unexpected error occurred.</div>
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gradient-to-r from-purple-300 to-white relative overflow-hidden">
        {/* Logo - responsive positioning */}
        <Image
          src={"/images/logo.png"}
          alt="logo"
          width={40}
          height={40}
          className="absolute top-4 left-4 sm:top-8 sm:left-8 cursor-pointer z-10"
          priority
        />

        {/* Main content container */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
          {/* Title - responsive text sizing */}
          <h1 className="font-semibold mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase text-center leading-tight">
            Create An Account.
          </h1>

          {/* Form container - improved responsive widths */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl py-6 px-4 sm:py-8 sm:px-6 gap-2 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg"
          >
            {/* Form header */}
            <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-bold mb-2">
              Welcome, Chief.
            </h2>
            <p className="capitalize text-sm sm:text-base text-gray-400 text-center max-w-xs mx-auto leading-relaxed mb-4">
              Enter your details to create an account.
            </p>

            {/* Form fields */}
            <div className="w-full flex flex-col p-3 sm:p-5 space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm sm:text-base font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Password requirements hint */}
              <div className="text-xs text-gray-500 mt-1">
                <p>Password should be at least 8 characters long</p>
              </div>
            </div>

            {/* Sign up button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed w-full sm:w-2/3 md:w-1/2 text-sm sm:text-base rounded-3xl py-2.5 sm:py-3 text-white self-center transition-colors font-medium"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login link */}
            <p className="text-xs sm:text-sm text-center my-4 px-2">
              Already Have An Account?{" "}
              <Link href="/">
                <span className="font-bold underline text-purple-500 cursor-pointer hover:text-purple-600 transition-colors">
                  Login
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
