import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

const Events = () => {
  const [eventType, setEventType] = useState("All");
  const [pagination, setPagination] = useState(1);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(
    null
  );

  const events = [
    {
      eventType: "Birthday Parties",
      organizer: "John Doe",
      location: "New York City",
      description: "A fun birthday bash with friends!",
      ticketPurchased: 50,
      active: true,
    },
    {
      eventType: "No Cup Parties",
      organizer: "Jane Smith",
      location: "Los Angeles",
      description: "An exclusive no cup party!",
      ticketPurchased: 30,
      active: false,
    },
    {
      eventType: "Birthday Parties",
      organizer: "Michael Johnson",
      location: "Chicago",
      description: "Surprise birthday party for a close friend.",
      ticketPurchased: 100,
      active: true,
    },
    {
      eventType: "No Cup Parties",
      organizer: "Emily Clark",
      location: "San Francisco",
      description: "A VIP only no cup party.",
      ticketPurchased: 20,
      active: false,
    },
    {
      eventType: "Birthday Parties",
      organizer: "Scott Davis",
      location: "Miami",
      description: "A grand birthday celebration by the beach.",
      ticketPurchased: 120,
      active: true,
    },
  ];

  const filteredEvents = events.filter((event) => {
    if (eventType === "All") return true;
    return event.eventType.toLowerCase() === eventType.toLowerCase();
  });

  const toggleModal = (index: number | null) => {
    setSelectedEventIndex(selectedEventIndex === index ? null : index);
  };

  return (
    <div className="w-[84%] px-10 py-5 h-screen">
      <div className="border-b border-gray-200 pb-2 flex justify-between">
        <h1 className="text-3xl">Events</h1>
        <button className="bg-purple-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 font-bold">
          Add Event {"  "} <FaPlus size={18} />
        </button>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-gray-300">
        <ul className="flex gap-10 text-base">
          <li
            className={`${
              eventType === "All"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setEventType("All")}
          >
            All
          </li>
          <li
            className={`${
              eventType === "Birthday Parties"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setEventType("Birthday Parties")}
          >
            Birthday Parties
          </li>
          <li
            className={`${
              eventType === "No Cup Parties"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setEventType("No Cup Parties")}
          >
            No Cup Parties
          </li>
        </ul>
        <div className="flex gap-10 items-center">
          <form className="flex gap-3 items-center p-2 rounded-md w-[280px] bg-[#F3F4F6]">
            <label htmlFor="submit">
              <IoMdSearch size={24} className="text-black cursor-pointer" />
            </label>
            <input
              type="text"
              placeholder="Search For Event By Organizer"
              className="outline-none flex-1 bg-transparent text-[#BCC1CA] text-base"
              required
            />
            <button id="submit" className="hidden">
              Submit
            </button>
          </form>
          <div className="flex gap-2 items-center p-2 rounded-md bg-[#F3F4F6] cursor-pointer">
            <CiFilter size={24} color="#565E6C" />
            <span className="text-[#565E6C]">Filter</span>
          </div>
        </div>
      </div>
      <table
        className="my-20 w-full rounded-tl-2xl rounded-tr-2xl border-separate border-spacing-0 overflow-hidden"
        onClick={() => setSelectedEventIndex(null)}
      >
        <thead className="text-left bg-purple-500 ">
          <tr>
            {[
              "Event Type",
              "Event Organizer",
              "Location",
              "Description",
              "Ticket Purchased",
              "Activity",
              "Action",
            ].map((title, index) => (
              <th key={index} className="pl-4 text-white py-5">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-purple-50">
          {filteredEvents.map((event, index) => (
            <tr key={index} className="border-b border-gray-200 text-gray-600">
              <td className="pl-4 py-3">{event.eventType}</td>
              <td className="pl-4 py-3">{event.organizer}</td>
              <td className="pl-4 py-3">{event.location}</td>
              <td className="pl-4 py-3">{event.description}</td>
              <td className="pl-4 py-3">{event.ticketPurchased}</td>
              <td className="pl-4 py-3">
                {event.active ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
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
                    <li className="cursor-pointer">Delete Event</li>
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="flex justify-center items-center gap-6">
        <FaAngleLeft
          size={16}
          color="#1b1b1b"
          cursor={"pointer"}
          onClick={() => setPagination((prev) => (prev <= 1 ? 5 : prev - 1))}
        />
        <li
          className={`${
            pagination === 1 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(1)}
        >
          1
        </li>
        <li
          className={`${
            pagination === 2 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(2)}
        >
          2
        </li>
        <li
          className={`${
            pagination === 3 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(3)}
        >
          3
        </li>
        <li
          className={`${
            pagination === 4 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(4)}
        >
          4
        </li>
        <li
          className={`${
            pagination === 5 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(5)}
        >
          5
        </li>
        <FaChevronRight
          size={16}
          color="#1b1b1b"
          onClick={() => setPagination((prev) => (prev >= 5 ? 1 : prev + 1))}
          cursor={"pointer"}
        />
      </ul>
    </div>
  );
};

export default Events;
