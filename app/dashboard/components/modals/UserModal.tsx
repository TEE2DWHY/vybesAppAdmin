import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import {
  FaCrown,
  FaBirthdayCake,
  FaCoins,
  FaHeart,
  FaBookmark,
  FaWeight,
  FaRulerVertical,
} from "react-icons/fa";
import {
  FiUser,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiGift,
  FiHeart,
  FiBookmark,
} from "react-icons/fi";
import { User } from "@/types";
import Image from "next/image";

interface UserModalProps {
  hideUserModal: () => void;
  user: User;
}

const UserModal: React.FC<UserModalProps> = ({ hideUserModal, user }) => {
  // State management
  const [showAnimation, setShowAnimation] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key and outside click
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideUserModal();
      }
    },
    [hideUserModal]
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        hideUserModal();
      }
    },
    [hideUserModal]
  );

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  }, []);

  // Get account type styling
  const getAccountTypeStyle = useCallback((accountType: string) => {
    switch (accountType.toLowerCase()) {
      case "vyber":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "baddie":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "premium":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  }, []);

  // Setup event listeners and animations
  useEffect(() => {
    // Add entrance animation
    setShowAnimation(true);

    // Add event listeners
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.body.style.overflow = "unset";
    };
  }, [handleEscape, handleOutsideClick]);

  // Info Item Component
  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: string;
  }> = ({ icon, label, value, color = "text-gray-600" }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className={`${color} flex-shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  );

  // Stats Card Component
  const StatsCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
  }> = ({ icon, label, value, color }) => (
    <div
      className={`${color} p-4 rounded-xl text-center transition-transform hover:scale-105`}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );

  console.log(user);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className={`bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
          showAnimation ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        role="dialog"
        aria-labelledby="user-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              {!imageError ? (
                <>
                  <Image
                    src={user.image}
                    alt={`${user.fullName} profile picture`}
                    fill
                    className="object-cover"
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setImageLoading(false);
                    }}
                    priority
                  />
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                  <IoPersonOutline className="text-white" size={32} />
                </div>
              )}

              {/* Online/Status Indicator */}
              {user.active && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1
                id="user-modal-title"
                className="text-2xl font-bold text-gray-900 capitalize truncate"
              >
                {user.fullName}
              </h1>
              <p className="text-gray-600 mb-2">@{user.userName}</p>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getAccountTypeStyle(
                  user.accountType
                )}`}
              >
                <FiUser size={12} className="mr-1" />
                {user.accountType}
              </div>
            </div>
          </div>

          <button
            onClick={hideUserModal}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close user details"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Bio Section */}
            {user.bio && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FiUser className="text-gray-600" size={16} />
                  About
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem
                  icon={<FiMail size={16} />}
                  label="Email"
                  value={user.email}
                  color="text-blue-500"
                />
                <InfoItem
                  icon={<FiPhone size={16} />}
                  label="Phone"
                  value={user.phoneNumber || "Not provided"}
                  color="text-green-500"
                />
                <InfoItem
                  icon={<FiMapPin size={16} />}
                  label="Location"
                  value={user.location || "Not specified"}
                  color="text-red-500"
                />
                <InfoItem
                  icon={<FiCalendar size={16} />}
                  label="Date of Birth"
                  value={user.dateOfBirth || "Not provided"}
                  color="text-purple-500"
                />
              </div>
            </div>

            {/* Physical Information */}
            {(user.height || user.weight) && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Physical Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {user.height && (
                    <InfoItem
                      icon={<FaRulerVertical size={16} />}
                      label="Height"
                      value={user.height}
                      color="text-indigo-500"
                    />
                  )}
                  {user.weight && (
                    <InfoItem
                      icon={<FaWeight size={16} />}
                      label="Weight"
                      value={user.weight}
                      color="text-orange-500"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                  icon={<FiHeart size={20} />}
                  label="Followers"
                  value={
                    user.followers?.vybers.length +
                      user.followers?.baddies.length || 0
                  }
                  color="bg-red-50 text-red-700"
                />
                <StatsCard
                  icon={<FiHeart size={20} />}
                  label="Following"
                  value={
                    user.following?.vybers.length +
                      user.following?.baddies.length || 0
                  }
                  color="bg-pink-50 text-pink-700"
                />
                <StatsCard
                  icon={<FiBookmark size={20} />}
                  label="Bookmarks"
                  value={user.bookmarks?.length || 0}
                  color="bg-yellow-50 text-yellow-700"
                />
                <StatsCard
                  icon={<FiBookmark size={20} />}
                  label="Cards"
                  value={user.cards?.length || 0}
                  color="bg-blue-50 text-blue-700"
                />
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FiDollarSign className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-800">
                      Wallet Balance
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(parseInt(user.walletBalance) || 0)}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FiGift className="text-purple-600" size={20} />
                    <span className="text-sm font-medium text-purple-800">
                      Gifted Coins
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {user.giftedCoins?.toLocaleString() || 0}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-3 mb-2">
                    <FaCrown className="text-yellow-600" size={20} />
                    <span className="text-sm font-medium text-yellow-800">
                      Premium Rate
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">
                    {user.premiumRate || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span
                className={`inline-flex items-center gap-1 ${
                  user.active ? "text-green-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.active ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                {user.active ? "Active User" : "Inactive User"}
              </span>
            </div>
            <button
              onClick={hideUserModal}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
