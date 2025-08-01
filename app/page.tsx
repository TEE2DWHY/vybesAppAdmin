"use client";

import { authInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useMemo } from "react";
import { AxiosError } from "axios";
import { SparklesCore } from "./dashboard/components/ui/sparkles";

interface FormData {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
}

const INITIAL_FORM_DATA: FormData = {
  email: "admin@vybesapp.com",
  password: "",
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = cookie.getCookie("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Memoized validation
  const isFormValid = useMemo(() => {
    return formData.email.trim() !== "" && formData.password.trim() !== "";
  }, [formData.email, formData.password]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleRememberMeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
    },
    []
  );

  const showError = useCallback(
    (errorMessage: string) => {
      messageApi.error(<div className="font-[outfit]">{errorMessage}</div>);
    },
    [messageApi]
  );

  const showSuccess = useCallback(
    (successMessage: string) => {
      messageApi.success(<div className="font-[outfit]">{successMessage}</div>);
    },
    [messageApi]
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormValid) {
        showError("Please fill in all required fields");
        return;
      }

      setIsLoading(true);
      messageApi.loading(<div className="font-[outfit]">Logging in...</div>);

      try {
        const response = await authInstance.post("/login", formData);

        const { message: responseMessage, payload } = response.data || {};
        const accessToken = payload?.accessToken;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        showSuccess(responseMessage || "Login successful!");

        // Store token with expiration based on remember me
        const expirationDays = rememberMe ? 30 : 1;
        cookie.storeCookie("token", accessToken, "");

        router.push("/dashboard");
      } catch (error: unknown) {
        console.error("Login error:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error instanceof AxiosError) {
          const apiError = error.response?.data as LoginError;
          errorMessage =
            apiError?.message ||
            error.message ||
            `Server error (${error.response?.status || "Unknown"})`;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData,
      isFormValid,
      rememberMe,
      messageApi,
      showError,
      showSuccess,
      router,
    ]
  );

  const handleForgotPassword = useCallback(() => {
    // Implement forgot password logic here
    messageApi.info(
      <div className="font-[outfit]">Forgot password feature coming soon!</div>
    );
  }, [messageApi]);

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gradient-to-r from-purple-300 to-white relative overflow-hidden">
        {/* Logo */}
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
          <Image
            src="/images/logo.png"
            alt="Vybes App Logo"
            width={40}
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            priority
          />
        </div>

        {/* Decorative lock animation */}
        <div className="absolute bottom-4 right-2 sm:bottom-10 sm:right-5">
          <Image
            src="/images/lock.gif"
            alt="Security animation"
            width={60}
            height={60}
            priority
            unoptimized
          />
        </div>

        <main className="flex flex-col items-center justify-center min-h-screen px-4 mt-[5%] sm:px-6 lg:px-8">
          <h1 className="font-semibold mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl uppercase text-center leading-tight">
            Admin Dashboard
          </h1>

          <form
            className="bg-white rounded-xl py-6 px-4 sm:py-8 sm:px-6 gap-2 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg"
            onSubmit={handleLogin}
            noValidate
          >
            <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-medium">
              Welcome Back, Admin
            </h2>
            <p className="capitalize text-sm sm:text-base text-gray-400 text-center max-w-xs mx-auto leading-relaxed">
              Enter your details to sign in to your account
            </p>

            <div className="w-full flex flex-col p-3 sm:p-5 space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm sm:text-base font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-describedby="email-error"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm sm:text-base font-medium text-gray-700"
                >
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="border border-gray-300 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="current-password"
                  aria-describedby="password-error"
                  minLength={6}
                />
              </div>

              {/* Remember me and forgot password */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mt-4 sm:mt-6">
                <label className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-purple-500 w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    disabled={isLoading}
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-purple-500 hover:text-purple-600 transition-colors text-left sm:text-right disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-2/3 md:w-1/2 text-sm sm:text-base rounded-3xl py-2.5 sm:py-3 text-white self-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              disabled={isLoading || !isFormValid}
              aria-describedby="login-button-description"
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>

            {/* Screen reader description for login button */}
            <span id="login-button-description" className="sr-only">
              {isLoading
                ? "Please wait while we sign you in"
                : "Click to sign in to your admin account"}
            </span>

            <p className="text-xs sm:text-sm text-center my-4 capitalize px-2">
              Don't have an admin account?{" "}
              <Link
                href="/register"
                className="font-bold underline text-purple-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
              >
                Sign Up Here
              </Link>
            </p>
          </form>

          {/* Sparkles animation */}
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
        </main>
      </div>
    </>
  );
};

export default LoginPage;
