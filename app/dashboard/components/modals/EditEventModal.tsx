import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Event } from "@/types";
import Image from "next/image";
import { message } from "antd";

interface EditUserModalProps {
  hideEventModal: () => void;
  event: Event;
}

const EditEventModal: React.FC<EditUserModalProps> = ({
  hideEventModal,
  event,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  return (
    <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center">
      <div className="bg-white w-[90%] sm:w-[32%] flex flex-col rounded-2xl px-6 py-6 shadow-lg relative">
        <div className="flex items-center justify-between w-full border-b border-gray-300 pb-2">
          <h2 className="font-semibold text-xl text-gray-800">Edit Details</h2>
          <MdOutlineCancel
            size={24}
            className="cursor-pointer text-gray-700"
            onClick={hideEventModal}
          />
        </div>
        <div className="flex items-center gap-4 mt-4">
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
            <p className="text-purple-600 font-semibold">Upload</p>
            <p className="text-gray-400 text-sm">
              Choose a file or drag & drop it here
            </p>
            <p className="text-gray-400 text-sm">
              JPEG, PNG, and MP4 formats, up to 10MB
            </p>
          </div>
        </div>

        <form className="mt-5 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">
              Event Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event name"
              defaultValue={event.name}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Event Type
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter event type"
              defaultValue={event.eventType}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter number of tickets purchased"
              defaultValue={event.ticketPurchased}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">DJs</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
