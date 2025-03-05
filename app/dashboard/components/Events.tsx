import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import Image from "next/image";
import { Empty } from "antd";
import { deleteItem } from "@/utils/triggerAdminRequest";

interface EventsProps {
  addEvent: () => void;
  setRefetchEvent: React.Dispatch<React.SetStateAction<boolean>>;
  refetchEvents: boolean;
}

interface Event {
  _id: string;
  eventType: string;
  name: string;
  location: string;
  description: string;
  ticketPurchased: number;
}

const Events: React.FC<EventsProps> = ({
  addEvent,
  refetchEvents,
  setRefetchEvent,
}) => {
  const [eventType, setEventType] = useState("All");
  const [pagination, setPagination] = useState(1);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<Event[] | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  const fetchAllEevents = async () => {
    try {
      const response = await adminInstance.get("/all-events", {
        params: {
          page: pagination,
          eventType: eventType,
        },
      });
      setEventData(response.data.payload?.events);
      setTotalPage(response.data.payload?.totalPage);
      setPageNumbers(
        Array.from(
          { length: response.data.payload?.totalPage },
          (_, i) => i + 1
        )
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setRefetchEvent(false);
    }
  };

  useEffect(() => {
    fetchAllEevents();
  }, [pagination, eventType]);

  useEffect(() => {
    if (refetchEvents) {
      fetchAllEevents();
    }
  }, [refetchEvents]);

  const filteredEvents = eventData?.filter((event) => {
    if (eventType === "All") return true;
    return event.eventType.toLowerCase() === eventType.toLowerCase();
  });

  const toggleModal = (index: number | null) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  const getFirstFiveWords = (description: string): string => {
    const words = description.split(" ");
    const firstFiveWords = words.slice(0, 5);
    return `${firstFiveWords.join(" ")}....`;
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteItem("/delete-event", eventId);
      setRefetchEvent(true);

      if (eventData && eventData.length === 1 && pagination > 1) {
        setPagination((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="w-[84%] px-4 py-3 h-screen overflow-y-scroll">
      <div className="border border-gray-300 py-6 px-8 rounded-xl">
        <div className="border-b border-gray-100 pb-2 flex justify-between">
          <h1 className="text-3xl font-bold">Events</h1>
          <button
            className="bg-purple-600 text-white px-4 py-3 flex items-center gap-2 font-bold text-sm rounded-lg"
            onClick={addEvent}
          >
            Add Event <FaPlus size={14} />
          </button>
        </div>

        {/* Filters and search form */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-300">
          <ul className="flex gap-10 text-base">
            {["All", "Birthday Parties", "No-Cup Parties"].map((type) => (
              <li
                key={type}
                className={`${
                  eventType === type
                    ? "text-purple-500 font-bold"
                    : "text-[#BFBFBF]"
                } cursor-pointer`}
                onClick={() => setEventType(type)}
              >
                {type}
              </li>
            ))}
          </ul>

          <div className="flex gap-10 items-center">
            <form className="flex gap-3 items-center p-2 rounded-md w-[280px] bg-[#F3F4F6]">
              <label htmlFor="submit">
                <IoMdSearch size={24} className="text-black cursor-pointer" />
              </label>
              <input
                type="text"
                placeholder="Search For Event By Event Name"
                className="outline-none flex-1 bg-transparent text-[#BCC1CA] w-[170px] text-sm"
                required
              />
              <button id="submit" className="hidden">
                Submit
              </button>
            </form>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-base font-medium">
            <Image
              src={"/images/bubble.gif"}
              width={70}
              height={70}
              unoptimized
              alt="loading-img"
            />
            Fetching Data...
          </div>
        ) : eventData && eventData.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center text-gray-600 text-lg">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="font-[outfit] capitalize"
            />
          </div>
        ) : (
          <table
            className="my-10 w-full rounded-tl-2xl rounded-tr-2xl border-separate border-spacing-0 overflow-hidden"
            onClick={() => setSelectedEventIndex(null)}
          >
            <thead className="text-left bg-purple-500 ">
              <tr>
                {[
                  "Event Type",
                  "Event Name",
                  "Location",
                  "Description",
                  "Action",
                ].map((title, index) => (
                  <th key={index} className="pl-4 text-white py-5">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-purple-50">
              {filteredEvents?.map((event, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-gray-600"
                >
                  <td className="pl-4 py-3">{event.eventType}</td>
                  <td className="pl-4 py-3 capitalize">{event.name}</td>
                  <td className="pl-4 py-3">{event.location}</td>
                  <td className="pl-4 py-3 capitalize">
                    {getFirstFiveWords(event.description)}
                  </td>
                  <td className="relative">
                    <span className="flex items-center justify-center cursor-pointer overflow-hidden">
                      <HiOutlineDotsHorizontal
                        size={24}
                        cursor={"pointer"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModal(index);
                        }}
                      />
                    </span>
                    {selectedEventIndex === index && (
                      <ul
                        className="flex flex-col gap-2 absolute bg-gray-200 rounded-md p-3 top-[-72px] items-center justify-center w-[130px] ml-[-50px] mr-0 z-30 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li className="cursor-pointer">View Details</li>
                        <li className="cursor-pointer">Edit Details</li>
                        <li
                          className="cursor-pointer"
                          onClick={() => handleDeleteEvent(event._id)}
                        >
                          Delete Event
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isLoading ||
          (eventData && eventData.length !== 0 && (
            <ul className="flex justify-center items-center gap-6">
              <FaAngleLeft
                size={16}
                color="#1b1b1b"
                cursor={"pointer"}
                onClick={() =>
                  setPagination((prev) => (prev <= 1 ? 1 : prev - 1))
                }
              />
              {pageNumbers.map((page) => (
                <li
                  key={page}
                  className={`${
                    pagination === page ? "bg-purple-500" : "bg-gray-500"
                  } rounded-md text-white px-3 py-1 cursor-pointer`}
                  onClick={() => setPagination(page)}
                >
                  {page}
                </li>
              ))}
              <FaChevronRight
                size={16}
                color="#1b1b1b"
                cursor={"pointer"}
                onClick={() =>
                  setPagination((prev) =>
                    totalPage !== null && prev >= totalPage ? 1 : prev + 1
                  )
                }
              />
            </ul>
          ))}
      </div>
    </div>
  );
};

export default Events;
