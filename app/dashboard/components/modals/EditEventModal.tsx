"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { IoClose, IoCheckmark, IoCloudUpload } from "react-icons/io5";
import {
  FiEdit3,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiUsers,
  FiMusic,
  FiTag,
} from "react-icons/fi";
import { Event } from "@/types";
import Image from "next/image";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";

interface EditEventModalProps {
  hideEventModal: () => void;
  event: Event;
  setRefetchEvents: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormData {
  name: string;
  eventType: string;
  location: string;
  description: string;
  ticketPurchased: number;
  dj: string;
  image: string;
  tickets: {
    regular: { price: number; available: number };
    vip: { price: number; available: number };
    vvip: { price: number; available: number };
  };
}

interface ValidationErrors {
  [key: string]: string;
}

const EVENT_TYPES = [
  "Birthday Parties",
  "In House Party",
  "Get Together",
  "No Cup Parties",
];

const TICKET_TYPES = [
  { key: "regular", label: "Regular", color: "bg-blue-50 border-blue-200" },
  { key: "vip", label: "VIP", color: "bg-purple-50 border-purple-200" },
  { key: "vvip", label: "VVIP", color: "bg-orange-50 border-orange-200" },
] as const;

const EditEventModal: React.FC<EditEventModalProps> = ({
  hideEventModal,
  event,
  setRefetchEvents,
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [imagePreview, setImagePreview] = useState(event.image);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data
  const [formData, setFormData] = useState<FormData>(() => {
    const ticketData = {
      regular: { price: 0, available: 0 },
      vip: { price: 0, available: 0 },
      vvip: { price: 0, available: 0 },
    };

    // Map the event tickets to the formData structure
    event.tickets.forEach((ticket) => {
      const ticketType = ticket.type.toLowerCase() as keyof typeof ticketData;
      if (ticketData[ticketType]) {
        ticketData[ticketType] = {
          price: ticket.price,
          available: ticket.available,
        };
      }
    });

    return {
      name: event.name,
      eventType: event.eventType || "",
      location: event.location,
      description: event.description,
      ticketPurchased: event.ticketPurchased,
      dj: event.dj.join(", "),
      image: event.image,
      tickets: ticketData,
    };
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Utilities
  const [messageApi, contextHolder] = message.useMessage();
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  // Validation
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Event name is required";
    }

    if (!formData.eventType) {
      errors.eventType = "Event type is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (formData.ticketPurchased < 0) {
      errors.ticketPurchased = "Tickets purchased cannot be negative";
    }

    // Validate tickets
    Object.entries(formData.tickets).forEach(([type, ticket]) => {
      if (ticket.price < 0) {
        errors[`${type}_price`] = `${type} ticket price cannot be negative`;
      }
      if (ticket.available < 0) {
        errors[
          `${type}_available`
        ] = `${type} available tickets cannot be negative`;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

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

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setHasChanges(true);

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
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showMessage("error", "Image size must be less than 10MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showMessage("error", "Please select a valid image file");
        return;
      }

      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setHasChanges(true);
    },
    [showMessage]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageChange(file);
      }
    },
    [handleImageChange]
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
        handleImageChange(e.dataTransfer.files[0]);
      }
    },
    [handleImageChange]
  );

  const resetImage = useCallback(() => {
    setImagePreview(event.image);
    setImageFile(null);
    setHasChanges(true);

    // Clean up object URL
    if (imagePreview && imagePreview !== event.image) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [event.image, imagePreview]);

  const handleTicketChange = useCallback(
    (
      ticketType: keyof FormData["tickets"],
      field: "price" | "available",
      value: string
    ) => {
      const numValue =
        field === "price" ? parseFloat(value) || 0 : parseInt(value) || 0;

      setFormData((prev) => ({
        ...prev,
        tickets: {
          ...prev.tickets,
          [ticketType]: {
            ...prev.tickets[ticketType],
            [field]: numValue,
          },
        },
      }));
      setHasChanges(true);

      // Clear validation error
      const errorKey = `${ticketType}_${field}`;
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

      setIsLoading(true);

      try {
        const data = new FormData();
        data.append("name", formData.name.trim());
        data.append("eventType", formData.eventType);
        data.append("location", formData.location.trim());
        data.append("description", formData.description.trim());
        data.append("ticketPurchased", formData.ticketPurchased.toString());
        data.append("dj", formData.dj.trim());

        if (imageFile) {
          data.append("image", imageFile);
        }

        // Append ticket data
        Object.entries(formData.tickets).forEach(([type, ticket]) => {
          data.append(`tickets[${type}][price]`, ticket.price.toString());
          data.append(
            `tickets[${type}][available]`,
            ticket.available.toString()
          );
        });

        await adminInstance.put(`/edit-event/${event._id}`, data);

        showMessage("success", "Event updated successfully!");
        setRefetchEvents(true);
        hideEventModal();
      } catch (error: any) {
        console.error("Error updating event:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update event. Please try again.";
        showMessage("error", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      formData,
      imageFile,
      validateForm,
      adminInstance,
      event._id,
      showMessage,
      setRefetchEvents,
      hideEventModal,
    ]
  );

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideEventModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hideEventModal]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== event.image) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, event.image]);

  return (
    <>
      {contextHolder}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiEdit3 className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                <p className="text-sm text-gray-600">
                  {hasChanges
                    ? "You have unsaved changes"
                    : "Update event details"}
                </p>
              </div>
            </div>
            <button
              onClick={hideEventModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close modal"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Event Image
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  dragActive
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 flex-shrink-0">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Event preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <IoCloudUpload className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      Drop your image here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG formats, up to 10MB
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        disabled={isLoading}
                      >
                        Change Image
                      </button>
                      {imagePreview !== event.image && (
                        <button
                          type="button"
                          onClick={resetImage}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                          disabled={isLoading}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <FiTag className="inline mr-2" />
                    Event Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                      validationErrors.name
                        ? "border-red-500"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    disabled={isLoading}
                    placeholder="Enter event name"
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="eventType"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <FiCalendar className="inline mr-2" />
                    Event Type *
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                      validationErrors.eventType
                        ? "border-red-500"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {validationErrors.eventType && (
                    <p className="text-red-500 text-xs">
                      {validationErrors.eventType}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700"
                >
                  <FiMapPin className="inline mr-2" />
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                    validationErrors.location
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  disabled={isLoading}
                  placeholder="Enter event location"
                />
                {validationErrors.location && (
                  <p className="text-red-500 text-xs">
                    {validationErrors.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
                >
                  <FiFileText className="inline mr-2" />
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 resize-none ${
                    validationErrors.description
                      ? "border-red-500"
                      : "border-gray-300 focus:border-purple-500"
                  }`}
                  disabled={isLoading}
                  placeholder="Describe your event"
                />
                <div className="flex justify-between items-center">
                  {validationErrors.description && (
                    <p className="text-red-500 text-xs">
                      {validationErrors.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs ml-auto">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="ticketPurchased"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <FiUsers className="inline mr-2" />
                    Tickets Purchased
                  </label>
                  <input
                    id="ticketPurchased"
                    type="number"
                    name="ticketPurchased"
                    value={formData.ticketPurchased}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                      validationErrors.ticketPurchased
                        ? "border-red-500"
                        : "border-gray-300 focus:border-purple-500"
                    }`}
                    disabled={isLoading}
                    min="0"
                    placeholder="0"
                  />
                  {validationErrors.ticketPurchased && (
                    <p className="text-red-500 text-xs">
                      {validationErrors.ticketPurchased}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="dj"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    <FiMusic className="inline mr-2" />
                    DJs
                  </label>
                  <input
                    id="dj"
                    type="text"
                    name="dj"
                    value={formData.dj}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isLoading}
                    placeholder="DJ names (comma separated)"
                  />
                </div>
              </div>

              {/* Ticket Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket Pricing
                </h3>
                {TICKET_TYPES.map(({ key, label, color }) => (
                  <div key={key} className={`p-4 rounded-lg border ${color}`}>
                    <h4 className="font-medium text-gray-800 mb-3">
                      {label} Ticket
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Price (₦)
                        </label>
                        <input
                          type="number"
                          value={formData.tickets[key].price || ""}
                          onChange={(e) =>
                            handleTicketChange(key, "price", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                            validationErrors[`${key}_price`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                        />
                        {validationErrors[`${key}_price`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors[`${key}_price`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Available
                        </label>
                        <input
                          type="number"
                          value={formData.tickets[key].available || ""}
                          onChange={(e) =>
                            handleTicketChange(key, "available", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-purple-500 ${
                            validationErrors[`${key}_available`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={isLoading}
                          min="0"
                          placeholder="0"
                        />
                        {validationErrors[`${key}_available`] && (
                          <p className="text-red-500 text-xs mt-1">
                            {validationErrors[`${key}_available`]}
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
                onClick={hideEventModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <IoCheckmark />
                    Save Changes
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

export default EditEventModal;
