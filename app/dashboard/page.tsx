"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";

interface DashboardProps {
  activeTab: string;
}

const Page: React.FC<DashboardProps> = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <>
      <div className="flex">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && <Users />}
        {activeTab === "events" && <Events />}
        {activeTab === "payments" && <Payments />}
      </div>
    </>
  );
};

export default Page;
