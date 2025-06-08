import React, { useEffect, useState } from "react";
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
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  useEffect(() => {
    if (!token) {
      router.replace("/");
    } else {
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
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-lg font-medium">
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <Image
            src={"/images/loading.gif"}
            width={80}
            height={80}
            unoptimized
            alt="loading-img"
          />
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
