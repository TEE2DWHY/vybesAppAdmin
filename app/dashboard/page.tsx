"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <>
      <div className="h-full w-full z-50 flex items-center justify-center bg-[#1b1b1b76] fixed">
        <div className="bg-white rounded-lg p-5 flex justify-between w-[40%]">
          <div>Account Type</div>
          <div>Wallet Balance</div>
          <div>Gender</div>
        </div>
      </div>
      <div className="flex">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && <Users />}
        {activeTab === "events" && <Events />}
        {activeTab === "payments" && <Payments />}
      </div>
    </>
  );
}
