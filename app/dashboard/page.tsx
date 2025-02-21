"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";

interface DashboardProps {
  activeTab: string;
}

const Page: React.FC<DashboardProps> = ({ activeTab }: DashboardProps) => {
  const [activeTabState, setActiveTabState] = useState(activeTab || "users");

  return (
    <div className="flex">
      <SideBar activeTab={activeTabState} setActiveTab={setActiveTabState} />
      {activeTabState === "users" && <Users />}
      {activeTabState === "events" && <Events />}
      {activeTabState === "payments" && <Payments />}
    </div>
  );
};

export default Page;
