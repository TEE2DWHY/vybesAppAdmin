"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState } from "react";
import { User } from "@/types";
import { GiCancel } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";

interface FilterModalProps {
  hideAddModal: () => void;
  filteredUsers: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRefetchEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddEvent: React.FC<FilterModalProps> = ({
  hideAddModal,
  setRefetchEvent,
}) => {
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
  const [tickets, setTickets] = useState([
    { type: "Regular", price: "", available: "" },
    { type: "VIP", price: "", available: "" },
    { type: "VVIP", price: "", available: "" },
  ]);
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

  const handleTicketChange = (
    index: number,
    field: keyof (typeof tickets)[0],
    value: string
  ) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    const { eventName, eventType, eventDescription, eventLocation } = formData;
    if (
      !eventName ||
      !eventType ||
      !eventDescription ||
      !eventLocation ||
      !image ||
      tickets.some((ticket) => !ticket.price || !ticket.available)
    ) {
      messageApi.error(
        <div className="font-[outfit]">
          Please fill in all fields, upload an image, and provide ticket
          details.
        </div>
      );
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", eventName);
    formDataToSubmit.append("eventType", eventType);
    formDataToSubmit.append("description", eventDescription);
    formDataToSubmit.append("location", eventLocation);
    formDataToSubmit.append("image", image);

    formDataToSubmit.append("tickets", JSON.stringify(tickets));

    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }

    try {
      await adminInstance.post("/create-event", formDataToSubmit);
      messageApi.success("Event created successfully!");
      setRefetchEvent(true);
      hideAddModal();
    } catch (error) {
      console.error("Error during submission:", error);
      messageApi.error("Failed to create event. Please try again.");
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b1b76] p-4"
        onClick={hideAddModal}
      >
        <div
          className="bg-white rounded-lg p-5 flex flex-col justify-between w-full max-w-[95%] sm:max-w-[90%] md:max-w-[50%] lg:max-w-[30%] max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-between mb-4 border-b border-gray-300 pb-1">
            <div className="w-full font-bold text-base">New Event</div>
            <div className="cursor-pointer" onClick={hideAddModal}>
              <GiCancel />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
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
                    {[
                      "Birthday Parties",
                      "In House Party",
                      "Get Together",
                      "No Cup Parties",
                    ].map((type) => (
                      <div
                        key={type}
                        className="py-2 px-4 hover:bg-gray-200 cursor-pointer text-sm"
                        onClick={() => handleSelectEventType(type)}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm">Event Description</label>
              <textarea
                name="eventDescription"
                value={formData.eventDescription}
                onChange={handleChange}
                placeholder="Enter Event Description"
                className="border border-gray-500 rounded-md outline-none px-3 py-2 h-[80px] text-sm"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
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

            <div className="flex flex-col gap-2">
              <label className="text-sm">Upload Event Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border py-3 px-4 border-gray-500 rounded-lg w-full outline-none text-sm text-black cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-4">
              {tickets.map((ticket, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label className="text-sm">{ticket.type} Ticket</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      className="border py-2 px-3 border-gray-500 rounded-lg w-full outline-none text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Available Tickets"
                      value={ticket.available}
                      onChange={(e) =>
                        handleTicketChange(index, "available", e.target.value)
                      }
                      className="border py-2 px-3 border-gray-500 rounded-lg w-full outline-none text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
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

export default AddEvent;
