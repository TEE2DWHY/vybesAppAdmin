import React, { useEffect, useState } from "react";
import { PiLetterCircleVBold } from "react-icons/pi";
import { TbCircleLetterB } from "react-icons/tb";
import { FaUsers } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { cookie } from "@/utils/storage";
import { createAdminInstance } from "@/config/axios";

interface UserProps {
  filterModal: any;
  filteredUser: any[];
  setFilteredUser: any;
}

const Users: React.FC<UserProps> = ({
  filterModal,
  filteredUser,
  setFilteredUser,
}) => {
  const [accountType, setAccountType] = useState("All");
  const [pagination, setPagination] = useState(1);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );
  const [token, setToken] = useState(cookie.getCookie("token"));
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalPage, setTotalPage] = useState<any | null>(null);
  const toggleModal = (index: number | null) => {
    setSelectedUserIndex(selectedUserIndex === index ? null : index);
  };
  const adminInstance = createAdminInstance(token);

  const pageNumbers = [];
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    (async () => {
      if (accountType === "Vyber" || accountType === "Baddie") {
        setPagination(1);
      }
      try {
        const resposne = await adminInstance.get("/get-users", {
          params: {
            page: pagination,
            accountType: accountType,
          },
        });
        setTotalPage(resposne?.data?.payload?.totalPage);
        setUserData(resposne?.data?.payload?.allUsers);
        setAllUsers(resposne.data?.payload?.users);
        setFilteredUser(resposne.data?.payload?.users);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [pagination, accountType]);

  const filterUser = (accountType: any) => {
    const filteredUser =
      accountType === "all"
        ? allUsers
        : allUsers.filter((user: any) => user.accountType === accountType);
    setFilteredUser(filteredUser);
  };
  const numberOfVybers = userData.filter(
    (user: any) => user?.accountType === "vyber"
  );

  const numberOfBaddies = userData.filter(
    (user: any) => user?.accountType === "baddie"
  );

  return (
    <div className="w-[84%]  px-4 py-5 h-screen  overflow-y-scroll">
      <div className="border border-gray-300 py-4 px-8 rounded-xl">
        <div>
          <h1 className="text-3xl border-b border-gray-200 pb-2 font-bold">
            Users
          </h1>
        </div>
        <div className="flex justify-between my-4">
          <div className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
            <PiLetterCircleVBold size={62} color="#fff" />
            <div>
              <h1 className="text-3xl text-white">{numberOfVybers.length}</h1>
              <h4 className="capitalize text-white">No of vybers</h4>
            </div>
          </div>
          <div className="rounded-md bg-gradient-to-r from-orange-500 to-orange-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
            <TbCircleLetterB size={62} color="#fff" />
            <div>
              <h1 className="text-3xl text-white">{numberOfBaddies.length}</h1>
              <h4 className="capitalize text-white">No of baddies</h4>
            </div>
          </div>
          <div className="rounded-md bg-gradient-to-r from-gray-700 to-gray-500 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
            <FaUsers size={62} color="#fff" />
            <div>
              <h1 className="text-3xl text-white">{userData?.length}</h1>
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
              onClick={() => {
                filterUser("all");
                setAccountType("All");
              }}
            >
              All
            </li>
            <li
              className={`${
                accountType === "Vyber"
                  ? "text-purple-500 font-bold"
                  : "text-[#BFBFBF]"
              } cursor-pointer`}
              onClick={() => {
                filterUser("vyber");
                setAccountType("Vyber");
              }}
            >
              Vyber
            </li>
            <li
              className={`${
                accountType === "Baddie"
                  ? "text-purple-500 font-bold"
                  : "text-[#BFBFBF]"
              } cursor-pointer`}
              onClick={() => {
                filterUser("baddie");
                setAccountType("Baddie");
              }}
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
            <div
              className="flex gap-2 items-center p-2 rounded-md bg-[#F3F4F6] cursor-pointer"
              onClick={filterModal}
            >
              <CiFilter size={24} color="#565E6C" />
              <span className="text-[#565E6C]">Filter</span>
            </div>
          </div>
        </div>
        <table
          className="my-10 w-full rounded-tl-2xl rounded-tr-2xl border-separate border-spacing-0 overflow-hidden"
          onClick={() => setSelectedUserIndex(null)}
        >
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
            {filteredUser?.map((user: any, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 text-gray-600"
              >
                <td className="pl-4 py-3 capitalize">{user.accountType}</td>
                <td className="pl-4 py-3 capitalize">{user.fullName}</td>
                <td className="pl-4 py-3 capitalize">{user.userName}</td>
                <td className="pl-4 py-3 capitalize">{user.gender}</td>
                <td className="pl-4 py-3">{user.phoneNumber}</td>
                <td className="pl-4 py-3">{user.walletBalance}</td>
                <td className="pl-4 py-3">
                  {user.active ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </td>
                <td className="relative">
                  <span className="flex items-center justify-center cursor-pointer overflow-hidden">
                    <HiOutlineDotsHorizontal
                      size={24}
                      cursor={"pointer"}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModal(index);
                      }}
                    />
                  </span>
                  {selectedUserIndex === index && (
                    <ul
                      className="flex flex-col gap-2 absolute bg-gray-200 rounded-md p-3 top-[-72px] items-center justify-center w-[130px] ml-[-50px] mr-0 z-30 shadow-lg"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <li className="cursor-pointer">View Details</li>
                      <li className="cursor-pointer">Edit Details</li>
                      <li className="cursor-pointer">Delete User</li>
                    </ul>
                  )}
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
            onClick={() =>
              setPagination((prev) => (prev <= 1 ? totalPage : prev - 1))
            }
          />
          {pageNumbers.map((pageNumber, index) => (
            <li
              key={index}
              className={`${
                pagination === pageNumber ? "bg-purple-500" : "bg-gray-500"
              } rounded-md text-white px-3 py-1 cursor-pointer`}
              onClick={() => setPagination(pageNumber)}
            >
              {pageNumber}
            </li>
          ))}

          <FaChevronRight
            size={16}
            onClick={() =>
              setPagination((prev) => (prev >= totalPage ? 1 : prev + 1))
            }
            className={`${
              pagination === totalPage ? "text-gray-400" : "#1b1b1b"
            }`}
            cursor={"pointer"}
          />
        </ul>
      </div>
    </div>
  );
};

export default Users;
