"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";
import FilterUsers from "./components/modals/FilterUsers";
import AuthWrapper from "@/utils/AuthWrapper";
import { User } from "@/types";
import FilterEvents from "./components/modals/addEvent";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const [showFilterUsersModal, setShowFilterUsersModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFilterEventModal, setShowFilterEventModal] = useState(false);

  return (
    <AuthWrapper>
      {showFilterEventModal && (
        <FilterEvents
          hideAddModal={() => setShowFilterEventModal(false)}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
        />
      )}
      {showFilterUsersModal && (
        <FilterUsers
          hideFilterModal={() => setShowFilterUsersModal(false)}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
        />
      )}
      <div className="flex">
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && (
          <Users
            filterModal={() => setShowFilterUsersModal(true)}
            filteredUser={filteredUsers}
            setFilteredUser={setFilteredUsers}
          />
        )}
        {activeTab === "events" && (
          <Events addEvent={() => setShowFilterEventModal(true)} />
        )}
        {activeTab === "payments" && <Payments />}
      </div>
    </AuthWrapper>
  );
}
