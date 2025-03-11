"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";
import FilterUsers from "./components/modals/FilterUsers";
import AuthWrapper from "@/utils/AuthWrapper";
import { User, Transaction, Event } from "@/types";
import AddEvent from "./components/modals/AddEvent";
import FilterTx from "./components/modals/FilterTx";
import DeleteModal from "./components/modals/DeleteModal";
import { deleteItem } from "@/utils/triggerAdminRequest";
import { message } from "antd";
import UserModal from "./components/modals/UserModal";
import EventModal from "./components/modals/EventModal";

const Page = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showFilterUsersModal, setShowFilterUsersModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFilterEventModal, setShowFilterEventModal] = useState(false);
  const [refetchEvents, setRefetchEvents] = useState(false);
  const [showFilterTxModal, setShowFilterTxModal] = useState(false);
  const [filteredTx, setFilteredTx] = useState<Transaction[]>([]);
  const [showDeleteModalUser, setShowDeleteModalUser] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModalEvent, setShowDeleteModalEvent] = useState(false);
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [event, setEvent] = useState<Event>();
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async (
    endpoint: string,
    userId: string,
    componentName: string
  ) => {
    try {
      await deleteItem(endpoint, userId);
      messageApi.success(
        <div className="font-[outfit]">
          {componentName} Deleted Successfully.
        </div>
      );
    } catch (error) {
      console.log(error);
    }
  };

  const showDeleteModalHandler = (id: string) => {
    setUserId(id);
    setShowDeleteModalUser(true);
  };

  const handleShowUserModal = (user: User) => {
    setUser(user);
    setShowUserModal(true);
  };

  const handleShowEventModal = (event: Event) => {
    console.log(event);
    setEvent(event);
    setShowEventModal(true);
  };

  return (
    <AuthWrapper>
      {contextHolder}
      {showUserModal && user && (
        <UserModal hideUserModal={() => setShowUserModal(false)} user={user} />
      )}
      {showEventModal && event && (
        <EventModal
          hideEventModal={() => setShowEventModal(false)}
          event={event}
        />
      )}
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
        {showDeleteModalEvent && (
          <DeleteModal
            componentName="event"
            hideDeleteModal={() => setShowDeleteModalEvent(false)}
            deleteFn={() => handleDelete("/delete-event", userId, "user")}
          />
        )}
        {showDeleteModalUser && (
          <DeleteModal
            componentName="user"
            hideDeleteModal={() => setShowDeleteModalUser(false)}
            deleteFn={() => handleDelete("/delete-user", eventId, "event")}
          />
        )}
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && (
          <Users
            filterModal={() => setShowFilterUsersModal(true)}
            filteredUser={filteredUsers}
            setFilteredUser={setFilteredUsers}
            showDeleteModal={showDeleteModalHandler}
            setShowUserModal={handleShowUserModal}
          />
        )}
        {activeTab === "events" && (
          <Events
            addEvent={() => setShowFilterEventModal(true)}
            refetchEvents={refetchEvents}
            setRefetchEvent={setRefetchEvents}
            showDeleteModal={() => setShowDeleteModalEvent(true)}
            setShowEventModal={handleShowEventModal}
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
};

export default Page;
