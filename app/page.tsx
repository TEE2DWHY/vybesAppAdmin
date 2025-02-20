"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FormData {
  email: string;
  password: string;
}

const Page: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "admin@vybesapp.com",
    password: "12345",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

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
      <div className="flex flex-col items-center justify-center h-[100vh] capitalize text-2xl">
        <h1 className="font-semibold mb-4 text-[24px] uppercase text-center lg:text-3xl">
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
          <div className="w-[100%] flex flex-col p-5">
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
              readOnly
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
      </div>
    </div>
  );
};

export default Page;
