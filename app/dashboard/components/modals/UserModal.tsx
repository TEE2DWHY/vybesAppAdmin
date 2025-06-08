import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegEnvelope,
  FaCrown,
  FaBirthdayCake,
  FaRegHeart,
  FaRegBookmark,
  FaCoins,
} from "react-icons/fa";
import { User } from "@/types";
import Image from "next/image";

interface UserModalProps {
  hideUserModal: () => void;
  user: User;
}

const UserModal: React.FC<UserModalProps> = ({ hideUserModal, user }) => {
  return (
    <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-lg relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 pb-2">
          <h2 className="font-semibold text-lg text-gray-800">User Details</h2>
          <MdOutlineCancel
            size={24}
            className="cursor-pointer text-black"
            onClick={hideUserModal}
          />
        </div>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
              <Image
                src={user.image}
                alt="user-img"
                layout="fill"
                objectFit="cover"
                priority
                unoptimized
              />
            </div>
            <div>
              <p className="text-lg font-medium capitalize">{user.fullName}</p>
              <p className="text-gray-600 text-sm">@{user.userName}</p>
            </div>
          </div>

          <div className="bg-[#EEFDF3] border font-medium rounded-2xl px-4 py-1 text-[#117B34] text-sm capitalize whitespace-nowrap">
            {user.accountType}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 space-y-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">Bio:</span>{" "}
            {user.bio || "No bio available."}
          </p>

          {/* Email & Location */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaRegEnvelope className="text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-teal-500" />
              <span>{user.location || "Not provided"}</span>
            </div>
          </div>

          {/* Phone & Premium Rate */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-500" />
              <span>{user.phoneNumber || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCrown className="text-yellow-600" />
              <span>{user.premiumRate} (Premium Rate)</span>
            </div>
          </div>

          {/* DOB, Followers, Following */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <FaBirthdayCake className="text-pink-500" />
              <span>{user.dateOfBirth}</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <FaRegHeart className="text-red-500" />
                <span>Followers: {user.followers.vybers}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegHeart className="text-red-500" />
                <span>Following: {user.following.vybers}</span>
              </div>
            </div>
          </div>

          {/* Height & Weight */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Height:</span>
              <span>{user.height}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Weight:</span>
              <span>{user.weight}</span>
            </div>
          </div>

          {/* Wallet & Gifted Coins */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <FaCoins className="text-green-500" />
              <span>Wallet Balance: ₦{user.walletBalance}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCoins className="text-purple-500" />
              <span>Gifted Coins: {user.giftedCoins}</span>
            </div>
          </div>

          {/* Bookmarks & Cards */}
          {(user.bookmarks.length > 0 || user.cards.length > 0) && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              {user.bookmarks.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaRegBookmark className="text-orange-500" />
                  <span>Bookmarks: {user.bookmarks.length}</span>
                </div>
              )}
              {user.cards.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaRegBookmark className="text-blue-400" />
                  <span>Cards: {user.cards.length}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
