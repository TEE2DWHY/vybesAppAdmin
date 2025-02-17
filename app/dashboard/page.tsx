"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";

interface PageProps {
  activeTab: string;
}

const page: React.FC<PageProps> = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <>
      <div className="flex">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="w-[80%] p-10">
          {activeTab === "users" && <Users />}
          {activeTab === "events" && <Events />}
          {activeTab === "payments" && <Payments />}
        </div>
      </div>
    </>
  );
};

export default page;
