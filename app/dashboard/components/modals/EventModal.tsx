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
    <div className="fixed z-50 inset-0 bg-[#1b1b1b62] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] max-h-[70%] sm:max-h-screen  overflow-y-auto rounded-2xl shadow-lg p-6 relative transition-all ease-in-out duration-300">
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <MdOutlineCancel
            size={30}
            onClick={hideEventModal}
            className="text-black bg-gray-200 hover:bg-gray-300 rounded-full p-1 cursor-pointer transition"
          />
        </div>

        {/* Modal Content */}
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Event Image */}
          <div className="w-full sm:w-1/2">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Event Details */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 capitalize">
              {event.name}
            </h2>
            <p className="text-sm text-gray-600 mb-4 capitalize text-justify">
              {event.description}
            </p>

            <p className="text-base font-medium mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-xl text-blue-500" />
              {event.location}
            </p>

            <p className="text-base mb-2 flex items-center">
              <HiMusicNote className="mr-2 text-xl text-purple-500" />
              {event.eventType}
            </p>

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

            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Tickets:</h3>
              {event.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 p-3 bg-gray-100 rounded-md">
                  <p className="text-sm font-medium flex items-center">
                    <FaTicketAlt className="mr-2 text-green-500" />
                    {ticket.type}: ₦{ticket.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ticket.available} tickets available
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm text-gray-700">
                Tickets Purchased: {event.ticketPurchased}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
