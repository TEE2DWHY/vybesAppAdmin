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
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoShieldCheckmarkOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { FiMail, FiLock, FiCheck } from "react-icons/fi";

interface FormData {
  email: string;
  password: string;
}

interface LoginError {
  message: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
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
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = cookie.getCookie("token");
    if (token) {
      setIsRedirecting(true);
      router.replace("/dashboard");
    }
  }, [router]);

  // Form validation
  const validateField = useCallback(
    (name: keyof FormData, value: string): string | null => {
      switch (name) {
        case "email":
          if (!value.trim()) return "Email is required";
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            return "Please enter a valid email address";
          return null;
        case "password":
          if (!value) return "Password is required";
          if (value.length < 5) return "Password must be at least 5 characters";
          return null;
        default:
          return null;
      }
    },
    []
  );

  // Memoized validation
  const isFormValid = useMemo(() => {
    return (
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.password.trim() !== "" &&
      formData.password.length >= 5
    );
  }, [formData.email, formData.password]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const fieldName = name as keyof FormData;

      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Clear error when user types
      if (validationErrors[fieldName]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const fieldName = name as keyof FormData;

      const error = validateField(fieldName, value);
      if (error) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    },
    [validateField]
  );

  const handleRememberMeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
    },
    []
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const showMessage = useCallback(
    (type: "success" | "error" | "info", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validate all fields
      const emailError = validateField("email", formData.email);
      const passwordError = validateField("password", formData.password);

      if (emailError || passwordError) {
        setValidationErrors({
          email: emailError || undefined,
          password: passwordError || undefined,
        });
        return;
      }

      setIsLoading(true);

      try {
        const response = await authInstance.post("/login", formData);

        const { message: responseMessage, payload } = response.data || {};
        const accessToken = payload?.accessToken;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        showMessage(
          "success",
          responseMessage || "Welcome back! Redirecting..."
        );

        // Store token with expiration based on remember me
        const expirationDays = rememberMe ? 30 : 1;
        cookie.storeCookie("token", accessToken, expirationDays);

        // Small delay for better UX
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
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

        showMessage("error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, rememberMe, validateField, showMessage, router]
  );

  const handleForgotPassword = useCallback(() => {
    showMessage(
      "info",
      "Please contact support for password reset assistance."
    );
  }, [showMessage]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-300 to-blue-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-800 font-medium">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-300 to-blue-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <IoShieldCheckmarkOutline className="text-white" size={24} />
            </div>
            <div className="text-white font-bold text-lg">Vybes Admin</div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-xs font-medium">Secure Login</span>
          </div>
        </div>

        <main className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 mt-14">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoPersonOutline className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-white/80">Sign in to your admin dashboard</p>
            </div>

            {/* Login Form */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-6" noValidate>
                {/* Email field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className={`block w-full pl-10 pr-3 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all ${
                        validationErrors.email
                          ? "border-red-400"
                          : "border-white/30"
                      }`}
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-300 text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-white/60" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`block w-full pl-10 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all ${
                        validationErrors.password
                          ? "border-red-400"
                          : "border-white/30"
                      }`}
                      placeholder="Enter your password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      autoComplete="current-password"
                      minLength={5}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className="h-5 w-5 text-white/60 hover:text-white/80" />
                      ) : (
                        <IoEyeOutline className="h-5 w-5 text-white/60 hover:text-white/80" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-300 text-sm mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember me and forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      disabled={isLoading}
                    />
                    <span className="ml-2 text-sm text-white">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-white/80 hover:text-white transition-colors"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-white text-purple-600 py-3 px-4 rounded-xl font-semibold hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-6 text-center">
                <p className="text-white/80 text-sm">
                  Need an admin account?{" "}
                  <Link
                    href="mailto:hello@admin.vybesapp.com"
                    className="font-semibold text-white hover:text-white/80 transition-colors underline underline-offset-2"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <IoShieldCheckmarkOutline className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white/80 text-sm">Secure Access</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <IoPersonOutline className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white/80 text-sm">Admin Panel</p>
              </div>
            </div>

            {/* Sparkles animation */}
            <div className="w-full h-20 relative flex items-center justify-center mt-8">
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={400}
                className="w-full h-full"
                particleColor="#ffffff"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
