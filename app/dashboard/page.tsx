"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import Users from "./components/Users";
import Events from "./components/Events";
import Payments from "./components/Payments";
import FilterUsers from "./components/modals/FilterUsers";
import AuthWrapper from "@/utils/AuthWrapper";
import { User, Transaction, Event } from "@/types";
import FilterTx from "./components/modals/FilterTx";
import DeleteModal from "./components/modals/DeleteModal";
import { message } from "antd";
import UserModal from "./components/modals/UserModal";
import EventModal from "./components/modals/EventModal";
import {
  handleDelete,
  showDeleteModalHandler,
  showDeleteEventHandler,
  handleShowUserModal,
  handleShowEventModal,
  handleShowEditEventModal,
} from "../../utils/handlers";
import EditEventModal from "./components/modals/EditEventModal";
import AddEvent from "./components/modals/addEvent";

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
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [user, setUser] = useState<User>();
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [event, setEvent] = useState<Event>();
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <AuthWrapper>
      {contextHolder}
      {showUserModal && user && (
        <UserModal hideUserModal={() => setShowUserModal(false)} user={user} />
      )}
      {showEditEventModal && event && (
        <EditEventModal
          event={event}
          hideEventModal={() => setShowEditEventModal(false)}
          setRefetchEvents={setRefetchEvents}
        />
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
            deleteFn={() =>
              handleDelete(
                "/delete-event",
                eventId,
                "event",
                setShowDeleteModalEvent,
                messageApi
              )
            }
          />
        )}
        {showDeleteModalUser && (
          <DeleteModal
            componentName="user"
            hideDeleteModal={() => setShowDeleteModalUser(false)}
            deleteFn={() =>
              handleDelete(
                "/delete-user",
                userId,
                "user",
                setShowDeleteModalUser,
                messageApi
              )
            }
          />
        )}
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "users" && (
          <Users
            filterModal={() => setShowFilterUsersModal(true)}
            filteredUser={filteredUsers}
            setFilteredUser={setFilteredUsers}
            showDeleteModal={(id) =>
              showDeleteModalHandler(id, setUserId, setShowDeleteModalUser)
            }
            setShowUserModal={(user) =>
              handleShowUserModal(user, setUser, setShowUserModal)
            }
          />
        )}
        {activeTab === "events" && (
          <Events
            addEvent={() => setShowFilterEventModal(true)}
            refetchEvents={refetchEvents}
            setRefetchEvent={setRefetchEvents}
            showDeleteModal={(id) =>
              showDeleteEventHandler(id, setEventId, setShowDeleteModalEvent)
            }
            setShowEventModal={(event) =>
              handleShowEventModal(event, setEvent, setShowEventModal)
            }
            showEditModal={(event) => {
              handleShowEditEventModal(event, setEvent, setShowEditEventModal);
            }}
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
