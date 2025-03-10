"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";
import FilterUsers from "./components/modals/FilterUsers";
import AuthWrapper from "@/utils/AuthWrapper";
import { User, Transaction } from "@/types";
import AddEvent from "./components/modals/AddEvent";
import FilterTx from "./components/modals/FilterTx";
import DeleteModal from "./components/modals/DeleteModal";

export default function Page() {
  const [activeTab, setActiveTab] = useState("users");
  const [showFilterUsersModal, setShowFilterUsersModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFilterEventModal, setShowFilterEventModal] = useState(false);
  const [refetchEvents, setRefetchEvents] = useState(false);
  const [showFilterTxModal, setShowFilterTxModal] = useState(false);
  const [filteredTx, setFilteredTx] = useState<Transaction[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <AuthWrapper>
      {showFilterEventModal && (
        <AddEvent
          hideAddModal={() => setShowFilterEventModal(false)}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
          setRefetchEvent={setRefetchEvents}
        />
      )}
      {showFilterTxModal && (
        <FilterTx
          hideFilterModal={() => setShowFilterTxModal(false)}
          filteredTx={filteredTx}
          setFilteredTx={setFilteredTx}
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
        {showDeleteModal && (
          <DeleteModal
            componentName="user"
            hideDeleteModal={() => setShowDeleteModal(false)}
          />
        )}
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && (
          <Users
            filterModal={() => setShowFilterUsersModal(true)}
            filteredUser={filteredUsers}
            setFilteredUser={setFilteredUsers}
            showDeleteModal={() => setShowDeleteModal(true)}
          />
        )}
        {activeTab === "events" && (
          <Events
            addEvent={() => setShowFilterEventModal(true)}
            refetchEvents={refetchEvents}
            setRefetchEvent={setRefetchEvents}
          />
        )}
        {activeTab === "payments" && (
          <Payments
            setShowFilterTxModal={setShowFilterTxModal}
            showFilterTxModal={showFilterTxModal}
            setTransactions={setFilteredTx}
            transactions={filteredTx}
          />
        )}
      </div>
    </AuthWrapper>
  );
}
