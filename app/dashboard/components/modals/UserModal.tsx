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
    <>
      <div className="fixed z-50 w-full h-full bg-[#1b1b1b62] flex items-center justify-center">
        <div className="bg-white w-[40%] sm:w-[32%] flex flex-col rounded-2xl px-6 py-6 shadow-lg relative">
          <div className="flex items-center justify-between w-full border-b border-gray-400 pb-2">
            <h2 className="font-medium text-xl text-gray-800">User Details</h2>
            <MdOutlineCancel
              size={20}
              className="cursor-pointer text-black"
              onClick={hideUserModal}
            />
          </div>

          <div className="flex justify-between w-full mt-6">
            <div className="flex gap-4 items-center">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-purple-800">
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
                <p className="text-xl font-medium capitalize">
                  {user.fullName}
                </p>
                <p className="text-gray-600 text-sm">@{user.userName}</p>
              </div>
            </div>

            <div className="bg-[#EEFDF3] border font-medium rounded-2xl px-4 py-1 text-[#117B34] text-sm h-fit capitalize">
              {user.accountType}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-gray-800 text-sm">
              <span className="font-medium">Bio:</span>{" "}
              {user.bio || "No bio available."}
            </p>

            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaRegEnvelope size={16} className="text-gray-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt size={16} className="text-teal-500" />
                <span>{user.location || "Not provided"}</span>
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhoneAlt size={16} className="text-blue-500" />
                <span>{user.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCrown size={16} className="text-yellow-600" />
                <span>{user.premiumRate} (Premium Rate)</span>
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaBirthdayCake size={16} className="text-pink-500" />
                <span>{user.dateOfBirth}</span>
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaRegHeart size={16} className="text-red-500" />
                  <span>Followers: {user.followers.vybers}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaRegHeart size={16} className="text-red-500" />
                  <span>Following: {user.following.vybers}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between w-full  text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Height:</span>
                <span>{user.height} cm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Weight:</span>
                <span>{user.weight} kg</span>
              </div>
            </div>

            <div className="flex justify-between w-full">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCoins size={16} className="text-green-500" />
                <span>Wallet Balance: ${user.walletBalance}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCoins size={16} className="text-purple-500" />
                <span>Gifted Coins: {user.giftedCoins}</span>
              </div>
            </div>

            <div className="flex justify-between w-full">
              {user.bookmarks.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaRegBookmark size={16} className="text-orange-500" />
                  <span>Bookmarks: {user.bookmarks.length}</span>
                </div>
              )}

              {user.cards.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaRegBookmark size={16} className="text-blue-400" />
                  <span>Cards: {user.cards.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
