import React, { useState } from "react";
import { PiLetterCircleVBold } from "react-icons/pi";
import { TbCircleLetterB } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";

const Users = () => {
  const [accountType, setAccountType] = useState("All");
  const [pagination, setPagination] = useState(1);

  const users = [
    {
      accountType: "Vyber",
      fullName: "John Doe",
      username: "johndoe",
      gender: "Male",
      phoneNumber: "+1 234 567 890",
      walletBalance: "$120.50",
      active: true,
    },
    {
      accountType: "Baddie",
      fullName: "Jane Smith",
      username: "janesmith",
      gender: "Female",
      phoneNumber: "+1 987 654 321",
      walletBalance: "$250.75",
      active: false,
    },
    {
      accountType: "Vyber",
      fullName: "Michael Johnson",
      username: "mikejohnson",
      gender: "Male",
      phoneNumber: "+1 345 678 901",
      walletBalance: "$300.20",
      active: true,
    },
    {
      accountType: "Baddie",
      fullName: "Emily Clark",
      username: "emilyclark",
      gender: "Female",
      phoneNumber: "+1 111 222 333",
      walletBalance: "$500.40",
      active: false,
    },
    {
      accountType: "Baddie",
      fullName: "Scott Davis",
      username: "scottdavis",
      gender: "Male",
      phoneNumber: "+1 141 252 343",
      walletBalance: "$250.40",
      active: true,
    },
  ];

  const filteredUsers = users.filter((user) => {
    if (accountType === "All") return true;
    return user.accountType.toLowerCase() === accountType.toLowerCase();
  });

  return (
    <div className="w-full">
      <div>
        <h1 className="text-3xl border-b border-gray-200 pb-2">Users</h1>
      </div>
      <div className="flex justify-between my-8">
        <div className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <PiLetterCircleVBold size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">50</h1>
            <h4 className="capitalize text-white">No of vybers</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-orange-500 to-orange-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <TbCircleLetterB size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">90</h1>
            <h4 className="capitalize text-white">No of baddies</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-gray-700 to-gray-500 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <FaUsers size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">140</h1>
            <h4 className="capitalize text-white">Total No of users</h4>
          </div>
        </div>
        <div className="rounded-md bg-gradient-to-r from-green-500 to-green-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
          <FaUserAlt size={62} color="#fff" />
          <div>
            <h1 className="text-3xl text-white">120</h1>
            <h4 className="capitalize text-white">Active users</h4>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-300">
        <ul className="flex gap-10 text-base">
          <li
            className={`${
              accountType === "All"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setAccountType("All")}
          >
            All
          </li>
          <li
            className={`${
              accountType === "Vyber"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setAccountType("Vyber")}
          >
            Vyber
          </li>
          <li
            className={`${
              accountType === "Baddie"
                ? "text-purple-500 font-bold"
                : "text-[#BFBFBF]"
            } cursor-pointer`}
            onClick={() => setAccountType("Baddie")}
          >
            Baddie
          </li>
        </ul>
        <div className="flex gap-10 items-center">
          <form className="flex gap-3 items-center p-2 rounded-md w-[280px] bg-[#F3F4F6]">
            <label htmlFor="submit">
              <IoMdSearch size={24} className="text-black cursor-pointer" />
            </label>
            <input
              type="text"
              placeholder="Search For User By UserName"
              className="outline-none flex-1 bg-transparent text-[#BCC1CA] text-base"
              required
            />
            <button id="submit" className="hidden">
              Submit
            </button>
          </form>
          <div className="flex gap-2 items-center p-2 rounded-md bg-[#F3F4F6] cursor-pointer">
            <CiFilter size={24} color="#565E6C" />
            <span className="text-[#565E6C]">Filter</span>
          </div>
        </div>
      </div>
      <table className="my-12 w-full rounded-tl-2xl rounded-tr-2xl overflow-hidden border-spacing-0">
        <thead className="text-left bg-purple-500 ">
          <tr>
            <th className="pl-4 text-white py-5">Account Type</th>
            <th className="pl-4 text-white py-5">Full Name</th>
            <th className="pl-4 text-white py-5">Username</th>
            <th className="pl-4 text-white py-5">Gender</th>
            <th className="pl-4 text-white py-5">Phone Number</th>
            <th className="pl-4 text-white py-5">Wallet Balance</th>
            <th className="pl-4 text-white py-5">Active</th>
            <th className="pl-4 text-white py-5">Action</th>
          </tr>
        </thead>
        <tbody className="bg-purple-50">
          {filteredUsers.map((user, index) => (
            <tr key={index} className="border-b border-gray-200 text-gray-600">
              <td className="pl-4 py-3">{user.accountType}</td>
              <td className="pl-4 py-3">{user.fullName}</td>
              <td className="pl-4 py-3">{user.username}</td>
              <td className="pl-4 py-3">{user.gender}</td>
              <td className="pl-4 py-3">{user.phoneNumber}</td>
              <td className="pl-4 py-3">{user.walletBalance}</td>
              <td className="pl-4 py-3">
                {user.active ? (
                  <span className="text-green-500">Active</span>
                ) : (
                  <span className="text-red-500">Inactive</span>
                )}
              </td>
              <td>
                <span className="flex items-center justify-center cursor-pointer">
                  <HiOutlineDotsHorizontal size={24} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="flex justify-center items-center gap-6">
        <FaAngleLeft
          size={16}
          color="#1b1b1b"
          cursor={"pointer"}
          onClick={() => setPagination((prev) => (prev <= 1 ? 5 : prev - 1))}
        />
        <li
          className={`${
            pagination === 1 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(1)}
        >
          1
        </li>
        <li
          className={`${
            pagination === 2 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(2)}
        >
          2
        </li>
        <li
          className={`${
            pagination === 3 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(3)}
        >
          3
        </li>
        <li
          className={`${
            pagination === 4 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(4)}
        >
          4
        </li>
        <li
          className={`${
            pagination === 5 ? "bg-purple-500" : "bg-gray-500"
          } rounded-md text-white px-3 py-1 cursor-pointer`}
          onClick={() => setPagination(5)}
        >
          5
        </li>
        <FaChevronRight
          size={16}
          color="#1b1b1b"
          onClick={() => setPagination((prev) => (prev >= 5 ? 1 : prev + 1))}
        />
      </ul>
    </div>
  );
};

export default Users;
