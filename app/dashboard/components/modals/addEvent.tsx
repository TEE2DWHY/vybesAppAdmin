"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { User } from "@/types";
import { IoClose, IoCloudUpload, IoCheckmark } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import {
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiImage,
  FiTag,
} from "react-icons/fi";

interface FilterModalProps {
  hideAddModal: () => void;
  filteredUsers: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRefetchEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  eventName: string;
  eventType: string;
  eventDescription: string;
  eventLocation: string;
  ticketPurchased: number;
}

interface Ticket {
  type: string;
  price: string;
  available: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const INITIAL_FORM_DATA: FormData = {
  eventName: "",
  eventType: "",
  eventDescription: "",
  eventLocation: "",
  ticketPurchased: 0,
};

const INITIAL_TICKETS: Ticket[] = [
  { type: "Regular", price: "", available: "" },
  { type: "VIP", price: "", available: "" },
  { type: "VVIP", price: "", available: "" },
];

const EVENT_TYPES = [
  "Birthday Parties",
  "In House Party",
  "Get Together",
  "No Cup Parties",
];

const AddEvent: React.FC<FilterModalProps> = ({
  hideAddModal,
  setRefetchEvent,
}) => {
  // State management
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Utilities
  const [messageApi, contextHolder] = message.useMessage();
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  // Validation
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.eventName.trim()) {
      errors.eventName = "Event name is required";
    }

    if (!formData.eventType) {
      errors.eventType = "Event type is required";
    }

    if (!formData.eventDescription.trim()) {
      errors.eventDescription = "Event description is required";
    } else if (formData.eventDescription.length < 10) {
      errors.eventDescription = "Description must be at least 10 characters";
    }

    if (!formData.eventLocation.trim()) {
      errors.eventLocation = "Event location is required";
    }

    if (!image) {
      errors.image = "Event image is required";
    }

    // Validate tickets
    tickets.forEach((ticket, index) => {
      if (!ticket.price || parseFloat(ticket.price) <= 0) {
        errors[
          `ticket_${index}_price`
        ] = `${ticket.type} ticket price is required and must be greater than 0`;
      }
      if (!ticket.available || parseInt(ticket.available) <= 0) {
        errors[
          `ticket_${index}_available`
        ] = `${ticket.type} available tickets is required and must be greater than 0`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, image, tickets]);

  // Event handlers
  const showMessage = useCallback(
    (type: "success" | "error", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleSelectEventType = useCallback(
    (eventType: string) => {
      setFormData((prev) => ({ ...prev, eventType }));
      setIsDropdownOpen(false);

      // Clear validation error for eventType
      if (validationErrors.eventType) {
        setValidationErrors((prev) => {
          const { eventType, ...rest } = prev;
          return rest;
        });
      }
    },
    [validationErrors.eventType]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear validation error for this field
      if (validationErrors[name]) {
        setValidationErrors((prev) => {
          const { [name]: removed, ...rest } = prev;
          return rest;
        });
      }
    },
    [validationErrors]
  );

  const handleImageChange = useCallback(
    (file: File) => {
      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear validation error
      if (validationErrors.image) {
        setValidationErrors((prev) => {
          const { image, ...rest } = prev;
          return rest;
        });
      }
    },
    [validationErrors.image]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showMessage("error", "Image size must be less than 5MB");
          return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          showMessage("error", "Please select a valid image file");
          return;
        }

        handleImageChange(file);
      }
    },
    [handleImageChange, showMessage]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
          showMessage("error", "Image size must be less than 5MB");
          return;
        }

        if (!file.type.startsWith("image/")) {
          showMessage("error", "Please select a valid image file");
          return;
        }

        handleImageChange(file);
      }
    },
    [handleImageChange, showMessage]
  );

  const handleTicketChange = useCallback(
    (index: number, field: keyof Ticket, value: string) => {
      setTickets((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };
        return updated;
      });

      // Clear validation error for this ticket field
      const errorKey = `ticket_${index}_${field}`;
      if (validationErrors[errorKey]) {
        setValidationErrors((prev) => {
          const { [errorKey]: removed, ...rest } = prev;
          return rest;
        });
      }
    },
    [validationErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        showMessage("error", "Please fix the errors below");
        return;
      }

      setIsSubmitting(true);

      try {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("name", formData.eventName.trim());
        formDataToSubmit.append("eventType", formData.eventType);
        formDataToSubmit.append(
          "description",
          formData.eventDescription.trim()
        );
        formDataToSubmit.append("location", formData.eventLocation.trim());
        formDataToSubmit.append("image", image!);
        formDataToSubmit.append("tickets", JSON.stringify(tickets));

        await adminInstance.post("/create-event", formDataToSubmit);

        showMessage("success", "Event created successfully!");
        setRefetchEvent(true);
        hideAddModal();
      } catch (error: any) {
        console.error("Error creating event:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to create event. Please try again.";
        showMessage("error", errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      image,
      tickets,
      validateForm,
      adminInstance,
      showMessage,
      setRefetchEvent,
      hideAddModal,
    ]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideAddModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hideAddModal]);

  return (
    <>
      {contextHolder}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={hideAddModal}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Event
                </h2>
                <p className="text-sm text-gray-600">
                  Fill in the details to create your event
                </p>
              </div>
            </div>
            <button
              onClick={hideAddModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close modal"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <label
                  htmlFor="eventName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  <FiTag className="inline mr-2" />
                  Event Name *
                </label>
                <input
                  id="eventName"
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.eventName
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.eventName && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.eventName}
                  </p>
                )}
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <FiCalendar className="inline mr-2" />
                  Event Type *
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between transition-colors focus:ring-2 focus:ring-purple-500 ${
                      validationErrors.eventType
                        ? "border-red-500"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    onClick={toggleDropdown}
                    disabled={isSubmitting}
                  >
                    <span
                      className={
                        formData.eventType ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {formData.eventType || "Select event type"}
                    </span>
                    <IoIosArrowDown
                      className={`transform transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                      {EVENT_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors focus:bg-purple-50 focus:outline-none"
                          onClick={() => handleSelectEventType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {validationErrors.eventType && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.eventType}
                  </p>
                )}
              </div>

              {/* Event Description */}
              <div className="space-y-2">
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-semibold text-gray-700"
                >
                  <FiFileText className="inline mr-2" />
                  Event Description *
                </label>
                <textarea
                  id="eventDescription"
                  name="eventDescription"
                  value={formData.eventDescription}
                  onChange={handleChange}
                  placeholder="Describe your event in detail"
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 resize-none ${
                    validationErrors.eventDescription
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  disabled={isSubmitting}
                />
                <div className="flex justify-between items-center">
                  {validationErrors.eventDescription && (
                    <p className="text-red-500 text-xs">
                      {validationErrors.eventDescription}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs ml-auto">
                    {formData.eventDescription.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Event Location */}
              <div className="space-y-2">
                <label
                  htmlFor="eventLocation"
                  className="block text-sm font-semibold text-gray-700"
                >
                  <FiMapPin className="inline mr-2" />
                  Event Location *
                </label>
                <input
                  id="eventLocation"
                  type="text"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.eventLocation
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.eventLocation && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.eventLocation}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <FiImage className="inline mr-2" />
                  Event Image *
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-purple-500 bg-purple-50"
                      : validationErrors.image
                      ? "border-red-500"
                      : "border-gray-300 hover:border-purple-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <IoCheckmark />
                        <span className="text-sm font-medium">
                          Image uploaded successfully
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        disabled={isSubmitting}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <IoCloudUpload
                        size={48}
                        className="mx-auto text-gray-400"
                      />
                      <div>
                        <p className="text-gray-600 font-medium">
                          Drop your image here, or
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                          disabled={isSubmitting}
                        >
                          browse files
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
                {validationErrors.image && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors.image}
                  </p>
                )}
              </div>

              {/* Ticket Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket Pricing
                </h3>
                {tickets.map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 space-y-3"
                  >
                    <h4 className="font-medium text-gray-800">
                      {ticket.type} Ticket
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={ticket.price}
                          onChange={(e) =>
                            handleTicketChange(index, "price", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                            validationErrors[`ticket_${index}_price`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                        />
                        {validationErrors[`ticket_${index}_price`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors[`ticket_${index}_price`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Available Tickets
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={ticket.available}
                          onChange={(e) =>
                            handleTicketChange(
                              index,
                              "available",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                            validationErrors[`ticket_${index}_available`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          min="0"
                          disabled={isSubmitting}
                        />
                        {validationErrors[`ticket_${index}_available`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors[`ticket_${index}_available`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={hideAddModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <IoCheckmark />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEvent;
