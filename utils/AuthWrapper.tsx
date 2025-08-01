import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "./storage";
import Image from "next/image";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, []);

  const handleAuthFailure = useCallback(
    (error: any) => {
      console.log("Authorization error: ", error);
      setAuthError("Authentication failed. Redirecting to login...");

      setTimeout(() => {
        cookie.removeCookie("token");
        router.replace("/");
      }, 1500);
    },
    [router]
  );

  useEffect(() => {
    const token = cookie.getCookie("token");

    if (!token) {
      setAuthError("No authentication token found. Redirecting to login...");
      setTimeout(() => {
        router.replace("/");
      }, 1000);
      return;
    }

    const checkAuthorization = async () => {
      try {
        const adminInstance = createAdminInstance(token);
        await adminInstance.get("/get-admin");
        setProgress(100);

        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (error: any) {
        if (error.code === "NETWORK_ERROR" || error.code === "ERR_NETWORK") {
          setAuthError(
            "Network connection error. Please check your internet connection."
          );
          setTimeout(() => {
            checkAuthorization();
          }, 3000);
        } else {
          handleAuthFailure(error);
        }
      }
    };

    checkAuthorization();
  }, [router, handleAuthFailure]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="w-full max-w-md mx-auto text-center flex flex-col items-center">
          <div className="mb-8 flex flex-col items-center">
            <Image
              src={"/images/loading.gif"}
              width={80}
              height={80}
              unoptimized
              alt="loading-img"
            />

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              {authError || "Authenticating your session..."}
            </p>
          </div>

          <div className="w-full max-w-xs mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {progress < 100 ? `Loading... ${progress}%` : "Almost ready!"}
            </p>
          </div>

          {authError && (
            <div className="w-full max-w-xs p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <p className="text-red-700 text-sm">{authError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
