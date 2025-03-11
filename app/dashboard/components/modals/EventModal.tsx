import React from "react";
import { Event } from "@/types";
import { MdOutlineCancel } from "react-icons/md";
import { FaTicketAlt, FaRegUser, FaMapMarkerAlt } from "react-icons/fa";
import { HiMusicNote } from "react-icons/hi";

interface EventModalProps {
  hideEventModal: () => void;
  event: Event;
}

const EventModal: React.FC<EventModalProps> = ({ hideEventModal, event }) => {
  return (
    <>
      <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center transition-all ease-out duration-300 opacity-100">
        <div className="bg-white w-[90%] sm:w-[50%] md:w-[40%] lg:w-[35%] xl:w-[40%] flex flex-col sm:flex-row rounded-2xl px-6 py-6 shadow-lg relative transform transition-all ease-in-out duration-300 scale-95 hover:scale-100 overflow-auto">
          <div className="absolute top-2 right-2 mb-10">
            <MdOutlineCancel
              size={34}
              onClick={hideEventModal}
              className=" text-black rounded-full p-2 cursor-pointer"
            />
          </div>

          <div className="w-full sm:w-2/3 mb-4 sm:mb-0">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          </div>

          <div className="flex flex-col sm:w-2/3 sm:pl-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 capitalize">
              {event.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4 capitalize text-justify">
              {event.description}
            </p>

            {/* Location */}
            <p className="text-lg font-semibold mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-xl text-blue-500" />
              {event.location}
            </p>

            {/* Event Type */}
            <p className="text-md mb-2 flex items-center">
              <HiMusicNote className="mr-2 text-xl text-purple-500" />
              {event.eventType}
            </p>

            {/* DJs List */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">DJs:</h3>
              <ul className="list-disc pl-5">
                {event.dj.map((dj, index) => (
                  <li key={index} className="text-sm">
                    <FaRegUser className="inline-block mr-2 text-gray-600" />
                    {dj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ticket Information */}
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Tickets:</h3>
              {event.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium flex items-center">
                    <FaTicketAlt className="mr-2 text-green-500" />
                    {ticket.type}: ${ticket.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.available} tickets available
                  </p>
                </div>
              ))}
            </div>

            {/* Ticket Purchased */}
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                Tickets Purchased: {event.ticketPurchased}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
