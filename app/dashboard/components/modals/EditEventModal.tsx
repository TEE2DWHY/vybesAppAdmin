import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Event } from "@/types";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";

interface EditEventModalProps {
  hideEventModal: () => void;
  event: Event;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  hideEventModal,
  event,
}) => {
  return (
    <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center">
      <div className="bg-white w-[90%] sm:w-[32%] flex flex-col rounded-2xl px-6 py-6 shadow-lg relative">
        <div className="flex items-center justify-between w-full border-b border-gray-300 pb-2">
          <h2 className="font-semibold text-xl text-gray-800">Edit Details</h2>
          <MdOutlineCancel
            size={20}
            className="cursor-pointer text-gray-700"
            onClick={hideEventModal}
          />
        </div>
        <div className="flex justify-between mt-5">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
              <Image
                src={event.image}
                alt="profile-img"
                layout="fill"
                objectFit="cover"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col w-[70%]">
              <p className="text-gray-400 text-sm">
                Choose a file or drag & drop it here
              </p>
              <p className="text-gray-400 text-sm">
                JPEG, PNG, and MP4 formats, up to 10MB
              </p>
            </div>
          </div>
          <input type="file" accept="image/*" id="eventImage" hidden />
          <label
            className="flex justify-center gap-1 cursor-pointer"
            htmlFor="eventImage"
          >
            <FiEdit3 size={22} className="w-full text-purple-700" />
            <span className="w-full text-purple-700">Edit</span>
          </label>
        </div>

        <form className="mt-5 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Event Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              placeholder="Enter event name"
              defaultValue={event.name}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Event Type
            </label>
            <select
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              defaultValue={event.eventType || ""}
            >
              {/* Non-clickable placeholder */}
              <option value="" disabled>
                Select Event
              </option>
              <option value="Birthday Parties">Birthday Parties</option>
              <option value="In House Party">In House Party</option>
              <option value="Get Together">Get Together</option>
              <option value="No Cup Parties">No Cup Parties</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              placeholder="Enter location"
              defaultValue={event.location}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event description"
              defaultValue={event.description}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Tickets Purchased
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              placeholder="Enter number of tickets purchased"
              defaultValue={event.ticketPurchased}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">DJs</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              placeholder="Enter DJs (separate multiple names with commas)"
              defaultValue={event.dj.join(", ")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white rounded-md py-2 mt-6 hover:bg-purple-800"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
