import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Event } from "@/types";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";

interface EditEventModalProps {
  hideEventModal: () => void;
  event: Event;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  hideEventModal,
  event,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: event.name,
    eventType: event.eventType || "",
    location: event.location,
    description: event.description,
    ticketPurchased: event.ticketPurchased,
    dj: event.dj.join(", "),
    image: event.image,
  });
  const [imagePreview, setImagePreview] = useState(event.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance("token");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const resetImage = () => {
    setImagePreview(event.image);
    setImageFile(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("eventType", formData.eventType);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("ticketPurchased", formData.ticketPurchased.toString());
    data.append("dj", formData.dj);
    if (imageFile) data.append("image", imageFile);
    try {
      const response = await adminInstance.put("/edit-event", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Event updated successfully:", response);
      hideEventModal();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="profile-img"
                    layout="fill"
                    objectFit="cover"
                    priority
                    unoptimized
                  />
                )}
              </div>
              {imagePreview !== event.image && (
                <MdOutlineCancel
                  size={20}
                  className="absolute top-0 bg-white p-1 rounded-full cursor-pointer text-red-500 z-30"
                  onClick={resetImage}
                />
              )}
              <div className="flex flex-col w-[70%]">
                <p className="text-gray-400 text-sm">
                  Choose a file or drag & drop it here
                </p>
                <p className="text-gray-400 text-sm">
                  JPEG, PNG, and MP4 formats, up to 10MB
                </p>
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            id="eventImage"
            hidden
            onChange={handleImageChange}
          />
          <label
            className="flex justify-center gap-1 cursor-pointer"
            htmlFor="eventImage"
          >
            <FiEdit3 size={22} className="w-full text-purple-700" />
            <span className="w-full text-purple-700">Edit</span>
          </label>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSend}>
          <div>
            <label className="block text-gray-700 font-medium">
              Event Name
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              name="name"
              placeholder="Enter event name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Event Type
            </label>
            <select
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              disabled={isLoading}
            >
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
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              name="description"
              placeholder="Enter event description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Tickets Purchased
            </label>
            <input
              type="number"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              name="ticketPurchased"
              placeholder="Enter number of tickets purchased"
              value={formData.ticketPurchased}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">DJs</label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 capitalize"
              name="dj"
              placeholder="Enter DJs (separate multiple names with commas)"
              value={formData.dj}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white rounded-md py-2 mt-6 hover:bg-purple-800"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
