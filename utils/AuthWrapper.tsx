import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "./storage";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const token = cookie.getCookie("token");

  useEffect(() => {
    if (!token) {
      router.replace("/");
    } else {
      const adminInstance = createAdminInstance(token);
      const checkAuthorization = async () => {
        try {
          await adminInstance.get("/get-admin");
          setLoading(false);
        } catch (error) {
          console.log("Authorization error: ", error);
          router.replace("/");
        }
      };
      checkAuthorization();
    }
  }, [router, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[100vh] text-lg">
        Loading Dashboard...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
