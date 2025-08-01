import React, { useEffect, useState, useCallback, useMemo } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa6";
import { FiRefreshCw, FiDollarSign, FiActivity } from "react-icons/fi";
import { MdOutlineAttachMoney, MdTrendingUp } from "react-icons/md";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { Empty, message, Spin } from "antd";
import { Transaction } from "@/types";
import { generatePageNumbers } from "@/utils/generatePageNumbers";

interface PaymentEventProps {
  setShowFilterTxModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFilterTxModal: boolean;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

type TransactionType = "All" | "Transfer" | "Deposit" | "Conversion";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  isLoading?: boolean;
  prefix?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  gradient,
  isLoading = false,
  prefix = "",
}) => (
  <div
    className={`rounded-xl ${gradient} p-6 shadow-lg flex items-center gap-4 transition-transform hover:scale-105 min-w-[200px] flex-1`}
  >
    <div className="text-white opacity-90 flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="text-2xl md:text-3xl font-bold text-white truncate">
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          `${prefix}${
            typeof value === "number" ? value.toLocaleString() : value
          }`
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
    <p className="text-gray-600 text-lg font-medium mt-4">
      Fetching transactions...
    </p>
  </div>
);

const EmptyState: React.FC<{ txType: string }> = ({ txType }) => (
  <div className="h-[50vh] flex items-center justify-center">
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="font-[outfit] text-gray-500">
          No {txType.toLowerCase()} transactions found
        </span>
      }
    />
  </div>
);

const Payments: React.FC<PaymentEventProps> = ({
  setShowFilterTxModal,
  setTransactions,
  transactions,
}) => {
  const [txType, setTxType] = useState<TransactionType>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPriceUpdating, setIsPriceUpdating] = useState<boolean>(false);
  const [totalTransactionAmountInNaira, setTotalTransactionAmountInNaira] =
    useState<number>(0);
  const [allTransaction, setAllTransactions] = useState<string>("0");
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [inputCoinPrice, setInputCoinPrice] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [txId, setTxId] = useState<string>("");
  const [pagination, setPagination] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [transactingUsers] = useState<number>(4);

  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);
  const [messageApi, contextHolder] = message.useMessage();

  const transactionTypes: TransactionType[] = useMemo(
    () => ["All", "Transfer", "Deposit", "Conversion"],
    []
  );

  const stats = useMemo(
    () => [
      {
        title: "Total Transactions",
        value: allTransaction,
        icon: <FiActivity size={32} />,
        gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
      },
      {
        title: "Total Amount (₦)",
        value: Math.ceil(totalTransactionAmountInNaira),
        icon: <MdOutlineAttachMoney size={32} />,
        gradient: "bg-gradient-to-r from-green-500 to-green-600",
        prefix: "₦",
      },
      {
        title: "Vyber Coin Price",
        value: price,
        icon: <FiDollarSign size={32} />,
        gradient: "bg-gradient-to-r from-yellow-500 to-yellow-600",
        prefix: "₦",
      },
      {
        title: "Transacting Users",
        value: transactingUsers,
        icon: <MdTrendingUp size={32} />,
        gradient: "bg-gradient-to-r from-pink-500 to-pink-600",
      },
    ],
    [allTransaction, totalTransactionAmountInNaira, price, transactingUsers]
  );

  const showMessage = useCallback(
    (type: "success" | "error", content: string) => {
      messageApi[type]({
        content: <div className="font-[outfit]">{content}</div>,
        duration: 3,
      });
    },
    [messageApi]
  );

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  }, []);

  const fetchAllTransactions = useCallback(
    async (page: number, showLoader = true) => {
      if (showLoader) setIsLoading(true);

      try {
        const response = await adminInstance.get("/all-transactions", {
          params: {
            page: page,
            transactionType: txType === "All" ? undefined : txType,
          },
        });

        const { payload } = response.data;

        setTransactions(payload?.transactions || []);
        setTotalTransactionAmountInNaira(
          payload?.totalAmountTransactedInNaira || 0
        );
        setTotalPage(payload?.totalPage || 0);
        setAllTransactions(payload?.totalNoOfTransactions || "0");
        setPrice(payload?.price || 0);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        showMessage("error", "Failed to fetch transactions. Please try again.");
      } finally {
        if (showLoader) setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [txType, adminInstance, setTransactions, showMessage]
  );

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAllTransactions(pagination, false);
  }, [fetchAllTransactions, pagination]);

  const updateCoinPrice = useCallback(async () => {
    const priceValue = parseFloat(inputCoinPrice);

    if (!priceValue || priceValue <= 0) {
      showMessage("error", "Please provide a valid price greater than 0");
      return;
    }

    setIsPriceUpdating(true);

    try {
      const response = await adminInstance.post("/set-price", {
        price: priceValue,
      });

      setPrice(response.data?.payload || priceValue);
      setInputCoinPrice("");
      showMessage(
        "success",
        `Coin price updated to ₦${priceValue.toLocaleString()}`
      );
    } catch (error: any) {
      console.error("Error updating price:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update price";
      showMessage("error", errorMessage);
    } finally {
      setIsPriceUpdating(false);
    }
  }, [inputCoinPrice, adminInstance, showMessage]);

  const handleTxTypeChange = useCallback((type: TransactionType) => {
    setTxType(type);
    setPagination(1);
  }, []);

  const handleSearchForTx = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!txId.trim()) {
        showMessage("error", "Please enter a transaction ID");
        return;
      }

      setIsSearching(true);

      try {
        const response = await adminInstance.get(
          `/get-transaction/${txId.trim()}`
        );
        const transaction = response.data?.payload?.transaction;

        if (transaction) {
          setTransactions([transaction]);
          showMessage("success", "Transaction found successfully");
        } else {
          setTransactions([]);
          showMessage("error", "Transaction not found");
        }

        setTxId("");
      } catch (error: any) {
        console.error("Search error:", error);
        const errorMessage =
          error.response?.data?.message || "Transaction not found";
        showMessage("error", errorMessage);
        setTransactions([]);
      } finally {
        setIsSearching(false);
      }
    },
    [txId, adminInstance, setTransactions, showMessage]
  );

  const handlePaginationChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPage && page !== pagination) {
        setPagination(page);
      }
    },
    [totalPage, pagination]
  );

  const handlePriceInputChange = useCallback((value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputCoinPrice(value);
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchAllTransactions(pagination);
  }, [pagination, txType]);

  useEffect(() => {
    if (totalPage > 0) {
      generatePageNumbers(totalPage, setPageNumbers, pagination);
    }
  }, [pagination, totalPage]);

  return (
    <>
      {contextHolder}
      <div className="w-full px-4 py-5 h-screen overflow-y-auto mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Payments Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor and manage all transactions
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

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  gradient={stat.gradient}
                  prefix={stat.prefix}
                  isLoading={isLoading}
                />
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Update Vyber Coin Price
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
                <div className="flex-1 max-w-xs">
                  <label
                    htmlFor="coin-price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Price (₦)
                  </label>
                  <input
                    id="coin-price"
                    type="text"
                    value={inputCoinPrice}
                    onChange={(e) => handlePriceInputChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="Enter new price"
                    disabled={isPriceUpdating}
                  />
                </div>
                <button
                  onClick={updateCoinPrice}
                  disabled={isPriceUpdating || !inputCoinPrice}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  {isPriceUpdating ? (
                    <>
                      <Spin size="small" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Price"
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {transactionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTxTypeChange(type)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      txType === type
                        ? "bg-purple-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <form
                  onSubmit={handleSearchForTx}
                  className="flex items-center"
                >
                  <div className="relative flex items-center bg-gray-100 rounded-lg overflow-hidden">
                    <div className="pl-3">
                      <IoMdSearch size={20} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by Transaction ID..."
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
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
                  onClick={() => setShowFilterTxModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <CiFilter size={20} />
                  Filter
                </button>
              </div>
            </div>

            {isLoading ? (
              <LoadingSpinner />
            ) : transactions.length === 0 ? (
              <EmptyState txType={txType} />
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-purple-500">
                      <tr>
                        {[
                          "Amount",
                          "Transaction ID",
                          "Sender",
                          "Receiver",
                          "Type",
                          "Time",
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
                      {transactions.map((transaction, index) => (
                        <tr
                          key={transaction.transactionId || index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(parseInt(transaction.amount))}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {transaction.transactionId}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                            {transaction.sender || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                            {transaction.receiver || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.transactionType === "Transfer"
                                  ? "bg-blue-100 text-blue-800"
                                  : transaction.transactionType === "Deposit"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {formatTime(transaction.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
                      {pageNumbers.map((page, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            typeof page === "number" &&
                            handlePaginationChange(page)
                          }
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            pagination === page
                              ? "bg-purple-500 text-white border-purple-500"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
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
    </>
  );
};

export default Payments;
