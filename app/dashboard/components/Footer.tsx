import React from "react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <>
      <footer className="absolute bottom-4 right-8">
        <button
          className="bg-purple-700 px-4 py-2 rounded-full text-white hover:bg-purple-500 font-bold"
          onClick={() => router.push("/")}
        >
          Logout
        </button>
      </footer>
    </>
  );
};

export default Footer;
