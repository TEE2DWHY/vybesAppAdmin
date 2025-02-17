"use client";
import Image from "next/image";
import { useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="bg-gradient-to-r from-purple-300 to-white">
      <Image
        src={"/images/logo.png"}
        alt="logo"
        width={40}
        height={40}
        className="absolute top-8 left-8 cursor-pointer"
        priority
      />
      <div className="flex flex-col items-center justify-center h-[100vh] font-[family-name:var(--font-geist-mono)] capitalize text-2xl">
        <h1 className="font-semibold mb-4 text-[24px] uppercase text-center lg:text-3xl">
          Create An Account.
        </h1>
        <form className="bg-white rounded-xl py-5 px-3 gap-2 flex flex-col w-[90%] sm:w-[55%] lg:w-[35%] shadow-lg">
          <h2 className="text-black text-center font-extrabold text-3xl font-mono">
            Welcome
          </h2>
          <p className="capitalize text-base text-gray-400 text-center w-3/5 self-center">
            Enter your details to create an account.
          </p>
          <div className="w-[100%] flex flex-col p-5">
            <label className="text-base">Email</label>
            <input
              type="email"
              className="border border-gray-300 px-4 py-3 rounded-md text-sm w-full  bg-[#F8F9FA] outline-none text-black mb-2"
              placeholder="email"
              required
            />
            <label className="text-base">Password</label>
            <input
              type="password"
              className="border border-gray-300 px-4 py-3 rounded-md text-sm w-full  bg-[#F8F9FA] outline-none text-black"
              placeholder="password"
              required
            />
          </div>
          <button className="bg-purple-500 w-[35%] text-base rounded-3xl p-2 text-white self-center">
            Sign Up
          </button>
          <p className="text-base text-center my-4">
            Already Have An Account? {"  "}{" "}
            <a href="/">
              <span className="font-bold underline text-purple-500 cursor-pointer">
                Login
              </span>
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default page;
