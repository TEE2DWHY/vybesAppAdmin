import React, { useEffect, useState, useCallback, useMemo } from "react";
import { PiLetterCircleVBold } from "react-icons/pi";
import { TbCircleLetterB } from "react-icons/tb";
import { FaUsers, FaAngleLeft, FaChevronRight } from "react-icons/fa6";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FiRefreshCw } from "react-icons/fi";
import { createAdminInstance } from "@/config/axios";
import { Empty, message, Spin } from "antd";
import { User } from "@/types";
import { cookie } from "@/utils/storage";
import { FaUserAlt } from "react-icons/fa";

interface UserProps {
  filterModal: () => void;
  filteredUser: User[];
  setFilteredUser: React.Dispatch<React.SetStateAction<User[]>>;
  showDeleteModal: (userId: string) => void;
  setShowUserModal: (user: User) => void;
}

type AccountType = "All" | "Vyber" | "Baddie";

interface StatsCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  count,
  icon,
  gradient,
  isLoading = false,
}) => (
  <div
    className={`rounded-xl ${gradient} p-6 shadow-lg flex items-center gap-4 transition-transform hover:scale-105 min-w-[200px] flex-1`}
  >
    <div className="text-white opacity-90 flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="text-2xl font-bold text-white">
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          count.toLocaleString()
        )}
      </div>
      <div className="text-white/80 text-sm font-medium mt-1">{title}</div>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="h-[50vh] flex flex-col items-center justify-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-200 border-solid rounded-full animate-spin">
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    </div>
    <p className="text-gray-600 text-lg font-medium mt-4">Fetching users...</p>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="h-[50vh] flex items-center justify-center">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="font-[outfit] text-gray-500">
          No users found matching your criteria
        </span>
      }
    />
  </div>
);

const Users: React.FC<UserProps> = ({
  filterModal,
  filteredUser,
  setFilteredUser,
  showDeleteModal,
  setShowUserModal,
}) => {
  // State management
  const [accountType, setAccountType] = useState<AccountType>("All");
  const [pagination, setPagination] = useState<number>(1);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Instances and utilities
  const token = cookie.getCookie("token");

  console.log(token);
  const adminInstance = createAdminInstance(token);
  const [messageApi, contextHolder] = message.useMessage();

  // Account type options
  const accountTypes: AccountType[] = useMemo(
    () => ["All", "Vyber", "Baddie"],
    []
  );

  // Computed values
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }, [totalPage]);

  const stats = useMemo(() => {
    const vybers = userData.filter((user) => user?.accountType === "vyber");
    const baddies = userData.filter((user) => user?.accountType === "baddie");
    const activeUsers = userData.filter((user) => user?.active);

    return {
      vybers: vybers.length,
      baddies: baddies.length,
      total: userData.length,
      active: activeUsers.length,
    };
  }, [userData]);

  // Event handlers
  const toggleActionMenu = useCallback(
    (index: number | null) => {
      setSelectedUserIndex(selectedUserIndex === index ? null : index);
    },
    [selectedUserIndex]
  );

  const closeActionMenu = useCallback(() => {
    setSelectedUserIndex(null);
  }, []);

  const showMessage = useCallback(
    (type: "success" | "error", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  }, []);

  // API calls
  const fetchUsers = useCallback(
    async (showLoader = true) => {
      console.log("=== FETCH USERS CALLED ===");
      console.log("showLoader:", showLoader);
      console.log("pagination:", pagination);
      console.log("accountType:", accountType);
      console.log("token:", token);

      if (showLoader) setIsLoading(true);

      try {
        console.log("Making API call...");
        const response = await adminInstance.get("/get-users", {
          params: {
            page: pagination,
            accountType:
              accountType === "All" ? undefined : accountType.toLowerCase(),
          },
        });

        console.log("API Response:", response.data);
        const { payload } = response.data;

        setTotalPage(payload?.totalPage || 0);
        setUserData(payload?.allUsers || []);
        setAllUsers(payload?.users || []);
        setFilteredUser(payload?.users || []);
        console.log("Data set successfully");
      } catch (error) {
        console.log("API Error:", error);
        showMessage("error", "Failed to fetch users. Please try again.");
      } finally {
        console.log("Setting loading to false");
        if (showLoader) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [pagination, accountType, adminInstance, setFilteredUser, showMessage]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  const handleAccountTypeChange = useCallback(
    (type: AccountType) => {
      setAccountType(type);
      setPagination(1);
      closeActionMenu();
    },
    [closeActionMenu]
  );

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!userName.trim()) {
        showMessage("error", "Please enter a username to search");
        return;
      }

      setIsSearching(true);

      try {
        const response = await adminInstance.get(
          `/get-user/${userName.trim()}`
        );
        const user = response.data?.payload?.user;

        if (user) {
          setFilteredUser([user]);
          showMessage("success", "User found successfully");
        } else {
          setFilteredUser([]);
          showMessage("error", "User not found");
        }

        setUserName("");
      } catch (error: any) {
        console.error("Search error:", error);
        const errorMessage = error.response?.data?.message || "User not found";
        showMessage("error", errorMessage);
        setFilteredUser([]);
      } finally {
        setIsSearching(false);
      }
    },
    [userName, adminInstance, setFilteredUser, showMessage]
  );

  const handleUserAction = useCallback(
    (action: "view" | "delete", user: User) => {
      closeActionMenu();

      if (action === "view") {
        setShowUserModal(user);
      } else {
        showDeleteModal(user._id);
      }
    },
    [closeActionMenu, setShowUserModal, showDeleteModal]
  );

  const handlePaginationChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPage && page !== pagination) {
        setPagination(page);
        closeActionMenu();
      }
    },
    [totalPage, pagination, closeActionMenu]
  );

  // Main data fetching effect
  useEffect(() => {
    fetchUsers();
  }, [pagination, accountType]);

  // Effect for account type filtering
  useEffect(() => {
    if (accountType !== "All") {
      const filtered = allUsers.filter(
        (user) => user.accountType === accountType.toLowerCase()
      );
      setFilteredUser(filtered);
    } else {
      setFilteredUser(allUsers);
    }
  }, [accountType, allUsers, setFilteredUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => closeActionMenu();

    if (selectedUserIndex !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [selectedUserIndex, closeActionMenu]);

  return (
    <div className="w-full md:w-[84%] px-4 py-5 h-screen overflow-y-auto">
      {contextHolder}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor user accounts
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <FiRefreshCw
                className={`${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Vybers"
              count={stats.vybers}
              icon={<PiLetterCircleVBold size={48} />}
              gradient="bg-gradient-to-r from-blue-500 to-blue-600"
              isLoading={isLoading}
            />
            <StatsCard
              title="Baddies"
              count={stats.baddies}
              icon={<TbCircleLetterB size={48} />}
              gradient="bg-gradient-to-r from-orange-500 to-orange-600"
              isLoading={isLoading}
            />
            <StatsCard
              title="Total Users"
              count={stats.total}
              icon={<FaUsers size={48} />}
              gradient="bg-gradient-to-r from-gray-600 to-gray-700"
              isLoading={isLoading}
            />
            <StatsCard
              title="Active Users"
              count={stats.active}
              icon={<FaUserAlt size={48} />}
              gradient="bg-gradient-to-r from-green-500 to-green-600"
              isLoading={isLoading}
            />
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Account Type Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {accountTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAccountTypeChange(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    accountType === type
                      ? "bg-purple-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden">
                  <div className="pl-3">
                    <IoMdSearch size={20} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-transparent px-3 py-2 pr-4 outline-none text-gray-900 placeholder-gray-500 w-64"
                    disabled={isSearching}
                  />
                  {isSearching && (
                    <div className="pr-3">
                      <Spin size="small" />
                    </div>
                  )}
                </div>
              </form>

              <button
                onClick={filterModal}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <CiFilter size={20} />
                Filter
              </button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredUser.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-purple-500">
                    <tr>
                      {[
                        "Account Type",
                        "Full Name",
                        "Username",
                        "Gender",
                        "Phone Number",
                        "Wallet Balance",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-white"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUser.map((user, index) => (
                      <tr
                        key={user._id || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              user.accountType === "vyber"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {user.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium capitalize">
                          {user.fullName || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          @{user.userName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {user.gender || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.phoneNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {formatCurrency(parseInt(user.walletBalance) || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              user.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleActionMenu(index);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <HiOutlineDotsHorizontal size={20} />
                          </button>

                          {selectedUserIndex === index && (
                            <div
                              className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[140px]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleUserAction("view", user)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleUserAction("delete", user)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Delete User
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPage > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => handlePaginationChange(pagination - 1)}
                    disabled={pagination <= 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaAngleLeft />
                  </button>

                  <div className="flex gap-1">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePaginationChange(number)}
                        className={`px-3 py-2 rounded-lg border transition-colors ${
                          pagination === number
                            ? "bg-purple-500 text-white border-purple-500"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePaginationChange(pagination + 1)}
                    disabled={pagination >= totalPage}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
