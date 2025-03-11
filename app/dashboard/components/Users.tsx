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
import { createAdminInstance } from "@/config/axios";
import { Empty } from "antd";
import Image from "next/image";
import { User } from "@/types";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import { FiRefreshCw } from "react-icons/fi";

interface UserProps {
  filterModal: () => void;
  filteredUser: User[];
  setFilteredUser: React.Dispatch<React.SetStateAction<User[]>>;
  showDeleteModal: (userId: string) => void;
  setShowUserModal: (user: User) => void;
}

const Users: React.FC<UserProps> = ({
  filterModal,
  filteredUser,
  setFilteredUser,
  showDeleteModal,
  setShowUserModal,
}) => {
  const [accountType, setAccountType] = useState<string>("All");
  const [pagination, setPagination] = useState<number | null>(1);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalPage, setTotalPage] = useState<number | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);
  const [messageApi, contextHolder] = message.useMessage();
  const [userName, setUserName] = useState("");
  const [refreshUser, setRefreshUser] = useState(false);

  const toggleModal = (index: number | null) => {
    setSelectedUserIndex(selectedUserIndex === index ? null : index);
  };

  useEffect(() => {
    const generatePageNumbers = () => {
      if (totalPage) {
        const numbers = [];
        for (let i = 1; i <= totalPage; i++) {
          numbers.push(i);
        }
        setPageNumbers(numbers);
      }
    };

    if (totalPage !== null) {
      generatePageNumbers();
    }
  }, [totalPage]);

  const refetchUser = async () => {
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
    } finally {
      setIsLoading(false);
      setRefreshUser(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, [pagination, accountType, setFilteredUser]);

  useEffect(() => {
    if (refreshUser) {
      setIsLoading(true);
      refetchUser();
    }
  }, [refreshUser]);

  const filterUser = (accountType: string) => {
    const filteredUser =
      accountType === "all"
        ? allUsers
        : allUsers.filter((user: User) => user.accountType === accountType);
    setFilteredUser(filteredUser);
  };

  const numberOfVybers = userData.filter(
    (user: User) => user?.accountType === "vyber"
  );

  const numberOfBaddies = userData.filter(
    (user: User) => user?.accountType === "baddie"
  );

  const handleSearchForUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await adminInstance.get(`/get-user/${userName}`);
      setFilteredUser([response.data?.payload?.user]);
      messageApi.success(
        <div className="font-[outfit]">Transaction Returned Successfully.</div>
      );
      console.log(response);
      setUserName("");
    } catch (error: any) {
      console.log(error);
      messageApi.error(
        <div className="font-[outfit] capitalize">
          {error.response.data.message}
        </div>
      );
    }
  };

  return (
    <div className="w-[84%]  px-4 py-5 h-screen  overflow-y-scroll">
      {contextHolder}
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
            <span
              className="flex gap-2 items-center text-gray-700 cursor-pointer"
              onClick={() => setRefreshUser(true)}
            >
              Refresh Users <FiRefreshCw />
            </span>
            <form
              className="flex gap-3 items-center p-2 rounded-md w-[280px] bg-[#F3F4F6]"
              onSubmit={handleSearchForUser}
            >
              <label htmlFor="submit">
                <IoMdSearch size={24} className="text-black cursor-pointer" />
              </label>
              <input
                type="text"
                placeholder="Search For User By UserName"
                className="outline-none flex-1 bg-transparent text-black text-base"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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

        {isLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-lg">
            <Image
              src={"/images/bubble.gif"}
              width={70}
              height={70}
              unoptimized
              alt="loading-img"
            />
            Fetching Data...
          </div>
        ) : filteredUser.length === 0 ? (
          <div className="h-[50vh] flex items-center justify-center text-gray-600 text-lg">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="font-[outfit] capitalize"
            />
          </div>
        ) : (
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
              {filteredUser?.map((user, index) => (
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
                        className="flex flex-col gap-2 absolute bg-white rounded-md p-3 top-[-72px] items-center justify-center w-[130px] ml-[-50px] mr-0 z-30 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <li
                          className="cursor-pointer text-black"
                          onClick={() => {
                            setSelectedUserIndex(null);
                            setShowUserModal(user);
                          }}
                        >
                          View Details
                        </li>
                        <li className="cursor-pointer text-black">
                          Edit Details
                        </li>
                        <li
                          className="cursor-pointer text-red-500"
                          onClick={() => {
                            setSelectedUserIndex(null);
                            showDeleteModal(user._id);
                          }}
                        >
                          Delete User
                        </li>
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isLoading ||
          (filteredUser.length !== 0 && (
            <ul className="flex justify-center items-center gap-6">
              <FaAngleLeft
                size={16}
                color="#1b1b1b"
                cursor={"pointer"}
                onClick={() =>
                  setPagination((prev) =>
                    prev === null || prev <= 1 ? totalPage : prev - 1
                  )
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
                  setPagination((prev) =>
                    prev === null || (totalPage !== null && prev >= totalPage)
                      ? 1
                      : prev + 1
                  )
                }
                className={`${
                  pagination === totalPage ? "text-gray-400" : "#1b1b1b"
                }`}
                cursor={"pointer"}
              />
            </ul>
          ))}
      </div>
    </div>
  );
};

export default Users;
