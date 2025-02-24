"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";
import FilterModal from "./components/modals/FilterModal";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <>
      {showFilterModal && (
        <FilterModal hideFilterModal={() => setShowFilterModal(false)} />
      )}
      <div className="flex">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && (
          <Users filterModal={() => setShowFilterModal(true)} />
        )}
        {activeTab === "events" && <Events />}
        {activeTab === "payments" && <Payments />}
      </div>
    </>
  );
}
