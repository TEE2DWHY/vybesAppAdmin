"use client";
import { createAdminInstance } from "@/config/axios";
import { cookie } from "@/utils/storage";
import { message } from "antd";
import React, { useState } from "react";
import { Transaction } from "@/types";

interface FilterModalProps {
  hideFilterModal: () => void;
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
        className="h-full w-full z-50 flex items-center justify-center bg-[#1b1b1b76] fixed p-4"
        onClick={hideFilterModal}
      >
        <div
          className="bg-white rounded-lg p-5 flex flex-col justify-between w-[40%] ml-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-between mb-4 border-b border-gray-300 pb-1">
            <div className="w-full font-bold">Filter</div>
            <div
              className="text-purple-600 font-bold cursor-pointer"
              onClick={applyFilters}
            >
              Apply
            </div>
          </div>
          <div className="flex justify-between w-[85%]">
            <div className="flex flex-col gap-2">
              <span className="">Transaction Type</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Transfer"
                    checked={transactionType === "Transfer"}
                    onChange={() => setTransactionType("Transfer")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Transfer
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Deposit"
                    checked={transactionType === "Deposit"}
                    onChange={() => setTransactionType("Deposit")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Deposit
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="transactionType"
                    value="Conversion"
                    checked={transactionType === "Conversion"}
                    onChange={() => setTransactionType("Conversion")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Conversion
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="transactionType"
                    value="All"
                    checked={transactionType === "All"}
                    onChange={() => setTransactionType("All")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  All
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="">Amount Range</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="amountRange"
                    value="0 - 50"
                    checked={amountRange === "0 - 50"}
                    onChange={() => setAmountRange("0 - 50")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  0 - 50
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="amountRange"
                    value="51 - 100"
                    checked={amountRange === "51 - 100"}
                    onChange={() => setAmountRange("51 - 100")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  51 - 100
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="amountRange"
                    value="101 - 150"
                    checked={amountRange === "101 - 150"}
                    onChange={() => setAmountRange("101 - 150")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  101 - 150
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="amountRange"
                    value="> 200"
                    checked={amountRange === "> 200"}
                    onChange={() => setAmountRange("> 200")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  &gt; 200
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="">Status</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="status"
                    value="Pending"
                    checked={status === "Pending"}
                    onChange={() => setStatus("Pending")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Pending
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="status"
                    value="Completed"
                    checked={status === "Completed"}
                    onChange={() => setStatus("Completed")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Completed
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="status"
                    value="Failed"
                    checked={status === "Failed"}
                    onChange={() => setStatus("Failed")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Failed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterTx;
