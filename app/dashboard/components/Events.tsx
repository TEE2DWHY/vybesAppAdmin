import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus, FaAngleLeft, FaChevronRight } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FiRefreshCw, FiCalendar, FiMapPin } from "react-icons/fi";
import { MdEventNote } from "react-icons/md";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { Empty, message, Spin } from "antd";
import { Event } from "@/types";

interface EventsProps {
  addEvent: () => void;
  setRefetchEvent: React.Dispatch<React.SetStateAction<boolean>>;
  refetchEvents: boolean;
  showDeleteModal: (eventId: string) => void;
  setShowEventModal: (event: Event) => void;
  showEditModal: (event: Event) => void;
}

type EventType = "All" | "Birthday Parties" | "No-Cup Parties";

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  gradient,
  isLoading = false,
}) => (
  <div
    className={`rounded-xl ${gradient} p-6 shadow-lg flex items-center gap-4 transition-transform hover:scale-105`}
  >
    <div className="text-white opacity-90">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-white">
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          count.toLocaleString()
        )}
      </div>
      <div className="text-white/80 text-sm font-medium">{title}</div>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="h-[50vh] flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-solid rounded-full animate-spin">
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    </div>
    <p className="text-gray-600 text-lg font-medium mt-4">Fetching events...</p>
  </div>
);

const EmptyState: React.FC<{ eventType: string }> = ({ eventType }) => (
  <div className="h-[50vh] flex items-center justify-center">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="font-[outfit] text-gray-500">
          {eventType === "All"
            ? "No events found"
            : `No ${eventType.toLowerCase()} found`}
        </span>
      }
    />
  </div>
);

const Events: React.FC<EventsProps> = ({
  addEvent,
  refetchEvents,
  setRefetchEvent,
  showDeleteModal,
  setShowEventModal,
  showEditModal,
}) => {
  // State management
  const [eventType, setEventType] = useState<EventType>("All");
  const [pagination, setPagination] = useState<number>(1);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [eventData, setEventData] = useState<Event[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [eventName, setEventName] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Instances and utilities
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);
  const [messageApi, contextHolder] = message.useMessage();

  // Event type options
  const eventTypes: EventType[] = useMemo(
    () => ["All", "Birthday Parties", "No-Cup Parties"],
    []
  );

  // Computed values
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }, [totalPage]);

  const filteredEvents = useMemo(() => {
    if (eventType === "All") return eventData;
    return eventData.filter(
      (event) => event.eventType.toLowerCase() === eventType.toLowerCase()
    );
  }, [eventData, eventType]);

  const stats = useMemo(() => {
    const birthdayParties = eventData.filter(
      (event) => event.eventType.toLowerCase() === "birthday parties"
    );
    const noCupParties = eventData.filter(
      (event) => event.eventType.toLowerCase() === "no-cup parties"
    );

    return {
      total: eventData.length,
      birthdayParties: birthdayParties.length,
      noCupParties: noCupParties.length,
    };
  }, [eventData]);

  // Utility functions
  const showMessage = useCallback(
    (type: "success" | "error", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  const getFirstFiveWords = useCallback((description: string): string => {
    if (!description) return "No description available";
    const words = description.split(" ");
    const firstFiveWords = words.slice(0, 5);
    return words.length > 5
      ? `${firstFiveWords.join(" ")}...`
      : firstFiveWords.join(" ");
  }, []);

  const toggleActionMenu = useCallback(
    (index: number | null) => {
      setSelectedEventIndex(selectedEventIndex === index ? null : index);
    },
    [selectedEventIndex]
  );

  const closeActionMenu = useCallback(() => {
    setSelectedEventIndex(null);
  }, []);

  // API calls
  const fetchAllEvents = useCallback(
    async (showLoader = true) => {
      if (showLoader) setIsLoading(true);

      try {
        const response = await adminInstance.get("/all-events", {
          params: {
            page: pagination,
            eventType: eventType === "All" ? undefined : eventType,
          },
        });

        const { payload } = response.data;

        setEventData(payload?.events || []);
        setTotalPage(payload?.totalPage || 0);
      } catch (error) {
        console.error("Error fetching events:", error);
        showMessage("error", "Failed to fetch events. Please try again.");
      } finally {
        if (showLoader) setIsLoading(false);
        setIsRefreshing(false);
        setRefetchEvent(false);
      }
    },
    [pagination, eventType, adminInstance, showMessage, setRefetchEvent]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAllEvents(false);
  }, [fetchAllEvents]);

  const handleEventTypeChange = useCallback(
    (type: EventType) => {
      setEventType(type);
      setPagination(1);
      closeActionMenu();
    },
    [closeActionMenu]
  );

  const handleSearchForEvent = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!eventName.trim()) {
        showMessage("error", "Please enter an event name to search");
        return;
      }

      setIsSearching(true);

      try {
        const response = await adminInstance.get(
          `/get-event/${eventName.trim()}`
        );
        const event = response.data?.payload?.event;

        if (event) {
          setEventData([event]);
          showMessage("success", "Event found successfully");
        } else {
          setEventData([]);
          showMessage("error", "Event not found");
        }

        setEventName("");
      } catch (error: any) {
        console.error("Search error:", error);
        const errorMessage = error.response?.data?.message || "Event not found";
        showMessage("error", errorMessage);
        setEventData([]);
      } finally {
        setIsSearching(false);
      }
    },
    [eventName, adminInstance, showMessage]
  );

  const handleEventAction = useCallback(
    (action: "view" | "edit" | "delete", event: Event) => {
      closeActionMenu();

      switch (action) {
        case "view":
          setShowEventModal(event);
          break;
        case "edit":
          showEditModal(event);
          break;
        case "delete":
          showDeleteModal(event._id);
          break;
      }
    },
    [closeActionMenu, setShowEventModal, showEditModal, showDeleteModal]
  );

  const handlePaginationChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPage && page !== pagination) {
        setPagination(page);
        closeActionMenu();
      }
    },
    [totalPage, pagination, closeActionMenu]
  );

  // Effects
  useEffect(() => {
    fetchAllEvents();
  }, [pagination, eventType]);

  useEffect(() => {
    if (refetchEvents) {
      setIsLoading(true);
      fetchAllEvents();
    }
  }, [refetchEvents, fetchAllEvents]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeActionMenu();

    if (selectedEventIndex !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedEventIndex, closeActionMenu]);

  return (
    <div className="w-full md:w-[84%] px-4 py-5 h-screen overflow-y-auto">
      {contextHolder}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Events Management
              </h1>
              <p className="text-gray-600 mt-1">Create and manage events</p>
            </div>
            <button
              onClick={addEvent}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 flex items-center gap-2 font-medium text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <FaPlus size={16} />
              Add Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <StatsCard
              title="Total Events"
              count={stats.total}
              icon={<MdEventNote size={32} />}
              gradient="bg-gradient-to-r from-blue-500 to-blue-600"
              isLoading={isLoading}
            />
            <StatsCard
              title="Birthday Parties"
              count={stats.birthdayParties}
              icon={<FiCalendar size={32} />}
              gradient="bg-gradient-to-r from-pink-500 to-pink-600"
              isLoading={isLoading}
            />
            <StatsCard
              title="No-Cup Parties"
              count={stats.noCupParties}
              icon={<FiMapPin size={32} />}
              gradient="bg-gradient-to-r from-orange-500 to-orange-600"
              isLoading={isLoading}
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Event Type Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleEventTypeChange(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    eventType === type
                      ? "bg-purple-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <FiRefreshCw
                  className={`${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <form
                onSubmit={handleSearchForEvent}
                className="flex items-center"
              >
                <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <div className="pl-3">
                    <IoMdSearch size={20} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by event name..."
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="bg-transparent px-3 py-2 pr-4 outline-none text-gray-900 placeholder-gray-500 w-64"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="pr-3">
                      <Spin size="small" />
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredEvents.length === 0 ? (
            <EmptyState eventType={eventType} />
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-purple-500">
                    <tr>
                      {[
                        "Event Type",
                        "Event Name",
                        "Location",
                        "Description",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-white"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEvents.map((event, index) => (
                      <tr
                        key={event._id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              event.eventType.toLowerCase().includes("birthday")
                                ? "bg-pink-100 text-pink-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {event.eventType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium capitalize">
                          {event.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {event.location || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span title={event.description}>
                            {getFirstFiveWords(event.description)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionMenu(index);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <HiOutlineDotsHorizontal size={20} />
                          </button>

                          {selectedEventIndex === index && (
                            <div
                              className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[140px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEventAction("view", event)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleEventAction("edit", event)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Edit Event
                              </button>
                              <button
                                onClick={() =>
                                  handleEventAction("delete", event)
                                }
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete Event
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPage > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => handlePaginationChange(pagination - 1)}
                    disabled={pagination <= 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaAngleLeft />
                  </button>

                  <div className="flex gap-1">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePaginationChange(number)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          pagination === number
                            ? "bg-purple-500 text-white border-purple-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePaginationChange(pagination + 1)}
                    disabled={pagination >= totalPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
