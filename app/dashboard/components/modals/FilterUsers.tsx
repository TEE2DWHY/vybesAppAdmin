"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { User } from "@/types";
import { IoClose, IoCheckmark } from "react-icons/io5";
import { FiFilter, FiDollarSign, FiUsers, FiUser } from "react-icons/fi";
import {
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked,
} from "react-icons/md";

interface FilterModalProps {
  hideFilterModal: () => void;
  filteredUsers: User[];
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

interface FilterState {
  gender: string;
  accountType: string;
  walletBalance: string;
}

const ACCOUNT_TYPES = [
  { value: "vyber", label: "Vyber", color: "text-blue-600", bg: "bg-blue-50" },
  {
    value: "baddie",
    label: "Baddie",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const WALLET_RANGES = [
  { value: "0-50", label: "₦0 - ₦50", description: "Low balance" },
  { value: "51-100", label: "₦51 - ₦100", description: "Medium balance" },
  { value: "101-150", label: "₦101 - ₦150", description: "High balance" },
  { value: ">200", label: "> ₦200", description: "Very high balance" },
];

const GENDERS = [
  { value: "male", label: "Male", color: "text-blue-600", bg: "bg-blue-50" },
  {
    value: "female",
    label: "Female",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

const FilterUsers: React.FC<FilterModalProps> = ({
  hideFilterModal,
  setFilteredUsers,
}) => {
  // State management
  const [filters, setFilters] = useState<FilterState>({
    gender: "",
    accountType: "",
    walletBalance: "",
  });
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);

  // Utilities
  const [messageApi, contextHolder] = message.useMessage();
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  // Check if any filters are applied
  const hasActiveFilters =
    filters.accountType || filters.gender || filters.walletBalance;
  const filterCount = [
    filters.accountType,
    filters.gender,
    filters.walletBalance,
  ].filter(Boolean).length;

  // Message utility
  const showMessage = useCallback(
    (type: "success" | "error" | "warning", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (category: keyof FilterState, value: string) => {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          [category]: prev[category] === value ? "" : value,
        };
        setHasChanges(true);
        return newFilters;
      });
    },
    []
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      gender: "",
      accountType: "",
      walletBalance: "",
    });
    setHasChanges(true);
  }, []);

  // Apply filters
  const applyFilters = useCallback(async () => {
    if (!hasActiveFilters) {
      showMessage("warning", "Please select at least one filter option");
      return;
    }

    setIsApplying(true);

    try {
      const params: any = {};

      if (filters.accountType) {
        params.accountType = filters.accountType;
      }
      if (filters.gender) {
        params.gender = filters.gender;
      }
      if (filters.walletBalance) {
        params.walletBalance = filters.walletBalance;
      }

      const response = await adminInstance.get("/filter-users", { params });

      const users = response.data.payload?.users || [];
      setFilteredUsers(users);

      showMessage(
        "success",
        `Found ${users.length} users matching your filters`
      );
      hideFilterModal();
    } catch (error: any) {
      console.error("Filter error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to apply filters. Please try again.";
      showMessage("error", errorMessage);
    } finally {
      setIsApplying(false);
    }
  }, [
    filters,
    hasActiveFilters,
    adminInstance,
    setFilteredUsers,
    hideFilterModal,
    showMessage,
  ]);

  // Custom radio button component
  const RadioButton: React.FC<{
    checked: boolean;
    onChange: () => void;
    children: React.ReactNode;
    color?: string;
    bg?: string;
    description?: string;
  }> = ({
    checked,
    onChange,
    children,
    color = "text-gray-700",
    bg,
    description,
  }) => (
    <label
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
        checked
          ? bg || "bg-purple-50 border border-purple-200"
          : "border border-transparent"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {checked ? (
          <MdOutlineRadioButtonChecked className="text-purple-600" size={18} />
        ) : (
          <MdOutlineRadioButtonUnchecked className="text-gray-400" size={18} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`font-medium text-sm ${
            checked ? "text-purple-700" : color
          }`}
        >
          {children}
        </div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideFilterModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hideFilterModal]);

  return (
    <>
      {contextHolder}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={hideFilterModal}
      >
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiFilter className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Filter Users
                </h2>
                <p className="text-sm text-gray-600">
                  {filterCount > 0
                    ? `${filterCount} filter${
                        filterCount > 1 ? "s" : ""
                      } applied`
                    : "No filters applied"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={hideFilterModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Close modal"
              >
                <IoClose size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Type */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiUsers className="text-purple-600" size={18} />
                  <h3 className="font-semibold text-gray-900">Account Type</h3>
                </div>
                <div className="space-y-2">
                  {ACCOUNT_TYPES.map((type) => (
                    <RadioButton
                      key={type.value}
                      checked={filters.accountType === type.value}
                      onChange={() =>
                        handleFilterChange("accountType", type.value)
                      }
                      color={type.color}
                      bg={type.bg}
                    >
                      {type.label}
                    </RadioButton>
                  ))}
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiDollarSign className="text-purple-600" size={18} />
                  <h3 className="font-semibold text-gray-900">
                    Wallet Balance
                  </h3>
                </div>
                <div className="space-y-2">
                  {WALLET_RANGES.map((range) => (
                    <RadioButton
                      key={range.value}
                      checked={filters.walletBalance === range.value}
                      onChange={() =>
                        handleFilterChange("walletBalance", range.value)
                      }
                      description={range.description}
                    >
                      {range.label}
                    </RadioButton>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <FiUser className="text-purple-600" size={18} />
                  <h3 className="font-semibold text-gray-900">Gender</h3>
                </div>
                <div className="space-y-2">
                  {GENDERS.map((gender) => (
                    <RadioButton
                      key={gender.value}
                      checked={filters.gender === gender.value}
                      onChange={() =>
                        handleFilterChange("gender", gender.value)
                      }
                      color={gender.color}
                      bg={gender.bg}
                    >
                      {gender.label}
                    </RadioButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3">
                  Active Filters:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.accountType && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <FiUsers size={12} />
                      {
                        ACCOUNT_TYPES.find(
                          (t) => t.value === filters.accountType
                        )?.label
                      }
                    </span>
                  )}
                  {filters.walletBalance && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      <FiDollarSign size={12} />
                      {
                        WALLET_RANGES.find(
                          (r) => r.value === filters.walletBalance
                        )?.label
                      }
                    </span>
                  )}
                  {filters.gender && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      <FiUser size={12} />
                      {GENDERS.find((g) => g.value === filters.gender)?.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={hideFilterModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isApplying}
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                disabled={isApplying || !hasActiveFilters}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center gap-2"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <IoCheckmark />
                    Apply Filters
                    {filterCount > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                        {filterCount}
                      </span>
                    )}
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

export default FilterUsers;
