"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState } from "react";
import { Transaction } from "@/types";

interface FilterModalProps {
  hideFilterModal: () => void;
  filteredTx: Transaction[];
  setFilteredTx: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const FilterTx: React.FC<FilterModalProps> = ({
  hideFilterModal,
  setFilteredTx,
}) => {
  const [transactionType, setTransactionType] = useState<string>("");
  const [amountRange, setAmountRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const token = cookie.getCookie("token");
  const adminInstance = createAdminInstance(token);

  const applyFilters = async () => {
    if (transactionType === "" && amountRange === "" && status === "") {
      return messageApi.error(
        <div className="font-[outfit]">Please make a selection</div>
      );
    }
    try {
      const response = await adminInstance.get("/filter-transactions", {
        params: {
          transactionType,
          amountRange,
          status,
        },
      });
      console.log(response.data.payload);
      setFilteredTx(response.data.payload?.transactions);
    } catch (error) {
      console.log(error);
    } finally {
      hideFilterModal();
    }
  };

  return (
    <>
      {contextHolder}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b1b76] p-4"
        onClick={hideFilterModal}
      >
        <div
          className="bg-white rounded-lg p-5 flex flex-col justify-between w-full max-w-lg sm:max-w-xl md:max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between mb-4 border-b border-gray-300 pb-1">
            <div className="font-bold text-lg">Filter</div>
            <div
              className="text-purple-600 font-bold cursor-pointer"
              onClick={applyFilters}
            >
              Apply
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Transaction Type */}
            <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
              <span className="font-semibold">Transaction Type</span>
              <ul className="flex flex-col gap-2">
                {["Transfer", "Deposit", "Conversion", "All"].map((type) => (
                  <li key={type} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="transactionType"
                      value={type}
                      checked={transactionType === type}
                      onChange={() => setTransactionType(type)}
                      className="accent-purple-600 cursor-pointer"
                    />
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* Amount Range */}
            <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
              <span className="font-semibold">Amount Range</span>
              <ul className="flex flex-col gap-2">
                {["0 - 50", "51 - 100", "101 - 150", "> 200"].map((range) => (
                  <li key={range} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="amountRange"
                      value={range}
                      checked={amountRange === range}
                      onChange={() => setAmountRange(range)}
                      className="accent-purple-600 cursor-pointer"
                    />
                    {range === "> 200" ? "> 200" : range}
                  </li>
                ))}
              </ul>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2 flex-1 min-w-[120px]">
              <span className="font-semibold">Status</span>
              <ul className="flex flex-col gap-2">
                {["Pending", "Completed", "Failed"].map((stat) => (
                  <li key={stat} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="status"
                      value={stat}
                      checked={status === stat}
                      onChange={() => setStatus(stat)}
                      className="accent-purple-600 cursor-pointer"
                    />
                    {stat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterTx;
