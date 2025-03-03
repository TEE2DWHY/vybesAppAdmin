"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState } from "react";
import { User } from "@/types";
import { GiCancel } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineUploadFile } from "react-icons/md";

interface FilterModalProps {
  hideAddModal: () => void;
  filteredUsers: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const FilterEvents: React.FC<FilterModalProps> = ({ hideAddModal }) => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    eventDescription: "",
    eventLocation: "",
    ticketPurchased: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectEventType = (eventType: string) => {
    setFormData({ ...formData, eventType });
    setIsDropdownOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { eventName, eventType, eventDescription, eventLocation } = formData;
    if (
      !eventName ||
      !eventType ||
      !eventDescription ||
      !eventLocation ||
      !image
    ) {
      messageApi.error("Please fill in all fields and upload an image.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("eventName", eventName);
    formDataToSubmit.append("eventType", eventType);
    formDataToSubmit.append("eventDescription", eventDescription);
    formDataToSubmit.append("eventLocation", eventLocation);
    formDataToSubmit.append(
      "ticketPurchased",
      formData.ticketPurchased.toString()
    );
    if (image) {
      formDataToSubmit.append("eventImage", image);
    }

    try {
      // Example: await adminInstance.post('/events', formDataToSubmit);
      console.log("Form submitted successfully:", formDataToSubmit);
      hideAddModal();
    } catch (error) {
      messageApi.error("Failed to create event. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="h-full w-full z-50 flex items-center justify-center bg-[#1b1b1b76] fixed p-4"
        onClick={hideAddModal}
      >
        <div
          className="bg-white rounded-lg p-5 flex flex-col justify-between w-[30%] ml-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-between mb-4 border-b border-gray-300 pb-1">
            <div className="w-full font-bold">New Event</div>
            <div className="cursor-pointer" onClick={hideAddModal}>
              <GiCancel />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                placeholder="Enter Event Name"
                className="border py-3 px-4 border-gray-500 rounded-lg w-full outline-none text-sm text-black"
              />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Event Type</label>
              <div className="relative">
                <div
                  className="border py-3 px-4 border-gray-500 rounded-lg w-full text-sm flex items-center justify-between cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <span>{formData.eventType || "Select Event Type"}</span>
                  <IoIosArrowDown className="cursor-pointer" />
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-10 bg-white border border-gray-700 rounded-lg w-full mt-1 overflow-hidden">
                    <div
                      className="py-2 px-4 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => handleSelectEventType("birthday")}
                    >
                      Birthday Event
                    </div>
                    <div
                      className="py-2 px-4 hover:bg-gray-200 cursor-pointer text-sm"
                      onClick={() => handleSelectEventType("nocup")}
                    >
                      No cup
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Event Description</label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                placeholder="Enter Event Description"
                className="border border-gray-500 rounded-md outline-none px-3 py-2 h-[100px] text-sm"
              ></textarea>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm">Event Location</label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                placeholder="Enter Event Location"
                className="border py-3 px-4 border-gray-500 rounded-lg w-full outline-none text-sm text-black"
              />
            </div>
            <div className="mb-3">
              <label className="text-sm">Upload Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border py-3 px-4 border-gray-500 rounded-lg w-full outline-none text-sm text-black"
              />
              {/* <div className="flex items-center justify-center my-3">
                <MdOutlineUploadFile
                  size={40}
                  cursor={"pointer"}
                  className="border-2 border-gray-400 rounded-full p-2"
                />
              </div> */}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-purple-700 text-white py-2 px-4 rounded-lg text-sm"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FilterEvents;
