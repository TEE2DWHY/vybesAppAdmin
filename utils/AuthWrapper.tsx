import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminInstance } from "@/config/axios";
import { cookie } from "./storage";
import Image from "next/image";

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
      <div className="flex flex-col items-center justify-center h-[100vh] text-lg font-medium">
        <Image
          src={"/images/loading.gif"}
          width={80}
          height={80}
          unoptimized
          alt="loading-img"
        />
        Loading Dashboard...
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
