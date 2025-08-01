"use client";

import { authInstance } from "@/config/axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { cookie } from "@/utils/storage";

interface FormData {
  email: string;
  password: string;
}

interface RegistrationError {
  message: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

const INITIAL_FORM_DATA: FormData = {
  email: "",
  password: "",
};

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REQUIREMENTS = {
  minLength: PASSWORD_MIN_LENGTH,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = cookie.getCookie("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  // Password strength validation
  const passwordStrength = useMemo(() => {
    const { password } = formData;
    if (!password) return { score: 0, feedback: [] };

    const feedback: string[] = [];
    let score = 0;

    if (password.length >= PASSWORD_REQUIREMENTS.minLength) score++;
    else feedback.push(`At least ${PASSWORD_MIN_LENGTH} characters`);

    if (PASSWORD_REQUIREMENTS.hasUppercase.test(password)) score++;
    else feedback.push("One uppercase letter");

    if (PASSWORD_REQUIREMENTS.hasLowercase.test(password)) score++;
    else feedback.push("One lowercase letter");

    if (PASSWORD_REQUIREMENTS.hasNumber.test(password)) score++;
    else feedback.push("One number");

    if (PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) score++;
    else feedback.push("One special character");

    return { score, feedback };
  }, [formData.password]);

  // Form validation
  const isFormValid = useMemo(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const isPasswordValid = passwordStrength.score >= 3; // Require at least 3/5 criteria
    return (
      isEmailValid &&
      isPasswordValid &&
      Object.keys(validationErrors).length === 0
    );
  }, [formData.email, passwordStrength.score, validationErrors]);

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
          if (value.length < PASSWORD_MIN_LENGTH)
            return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
          return null;
        default:
          return null;
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const fieldName = name as keyof FormData;

      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Real-time validation
      const error = validateField(fieldName, value);
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));

      // Show password requirements when user starts typing
      if (fieldName === "password" && value && !showPasswordRequirements) {
        setShowPasswordRequirements(true);
      }
    },
    [validateField, showPasswordRequirements]
  );

  const handlePasswordFocus = useCallback(() => {
    setShowPasswordRequirements(true);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    if (!formData.password) {
      setShowPasswordRequirements(false);
    }
  }, [formData.password]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Final validation
      const emailError = validateField("email", formData.email);
      const passwordError = validateField("password", formData.password);

      if (emailError || passwordError) {
        setValidationErrors({
          email: emailError || undefined,
          password: passwordError || undefined,
        });
        return;
      }

      if (!isFormValid) {
        showError("Please fix the form errors before submitting");
        return;
      }

      setIsLoading(true);
      messageApi.loading(
        <div className="font-[outfit]">Creating your account...</div>
      );

      try {
        const response = await authInstance.post("/register", formData);

        const { message: responseMessage } = response.data || {};
        showSuccess(responseMessage || "Account created successfully!");

        // Clear form
        setFormData(INITIAL_FORM_DATA);
        setValidationErrors({});
        setShowPasswordRequirements(false);

        // Redirect to login
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (error: unknown) {
        console.error("Registration error:", error);

        let errorMessage = "An unexpected error occurred. Please try again.";

        if (error instanceof AxiosError) {
          const apiError = error.response?.data as RegistrationError;
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
      validateField,
      showError,
      showSuccess,
      messageApi,
      router,
    ]
  );

  const getPasswordStrengthColor = (score: number): string => {
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (score: number): string => {
    if (score <= 1) return "Very Weak";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

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

        <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-semibold mb-6 sm:mb-8 text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase text-center leading-tight">
            Create An Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl py-6 px-4 sm:py-8 sm:px-6 gap-2 flex flex-col w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl shadow-lg"
            noValidate
          >
            <h2 className="text-black text-center text-lg sm:text-xl md:text-2xl font-bold mb-2">
              Welcome, Chief
            </h2>
            <p className="text-sm sm:text-base text-gray-400 text-center max-w-xs mx-auto leading-relaxed mb-4">
              Enter your details to create an account
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
                  className={`border px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:ring-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  }`}
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={
                    validationErrors.email ? "email-error" : undefined
                  }
                />
                {validationErrors.email && (
                  <p
                    id="email-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {validationErrors.email}
                  </p>
                )}
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
                  className={`border px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-sm w-full bg-[#F8F9FA] outline-none text-black focus:ring-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  }`}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  disabled={isLoading}
                  autoComplete="new-password"
                  minLength={PASSWORD_MIN_LENGTH}
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={`${
                    validationErrors.password ? "password-error" : ""
                  } ${
                    showPasswordRequirements ? "password-requirements" : ""
                  }`.trim()}
                />
                {validationErrors.password && (
                  <p
                    id="password-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {validationErrors.password}
                  </p>
                )}

                {/* Password strength indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                            passwordStrength.score
                          )}`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Password requirements */}
                {showPasswordRequirements && (
                  <div
                    id="password-requirements"
                    className="bg-gray-50 p-3 rounded-md mt-2"
                  >
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password must include:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {passwordStrength.feedback.map((requirement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          {requirement}
                        </li>
                      ))}
                      {passwordStrength.score === 5 && (
                        <li className="flex items-center gap-2 text-green-600">
                          <span>✓</span>
                          All requirements met!
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-2/3 md:w-1/2 text-sm sm:text-base rounded-3xl py-2.5 sm:py-3 text-white self-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-describedby="signup-button-description"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Screen reader description for signup button */}
            <span id="signup-button-description" className="sr-only">
              {isLoading
                ? "Please wait while we create your account"
                : "Click to create your admin account"}
            </span>

            <p className="text-xs sm:text-sm text-center my-4 px-2">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-bold underline text-purple-500 hover:text-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded"
              >
                Login Here
              </Link>
            </p>
          </form>
        </main>
      </div>
    </>
  );
};

export default RegisterPage;
