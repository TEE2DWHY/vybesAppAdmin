"use client";
import { message } from "antd";
import React, { useState } from "react";

interface FilterModalProps {
  hideFilterModal: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ hideFilterModal }) => {
  const [gender, setGender] = useState("");
  const [accountType, setAccountType] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const applyFilters = () => {
    console.log("Filters Applied:");
    console.log("Account Type:", accountType);
    console.log("Gender:", gender);
    console.log("Wallet Balance:", walletBalance);
    if (accountType === "" && gender === "" && walletBalance === "") {
      console.log("Error: Missing selection");
      return messageApi.error("Please make a selection");
    }
    hideFilterModal();
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
            {/* Account Type Filter */}
            <div className="flex flex-col gap-2">
              <span className="">Account Type</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="accountType"
                    value="vyber"
                    checked={accountType === "vyber"}
                    onChange={() => setAccountType("vyber")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Vyber
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="accountType"
                    value="baddie"
                    checked={accountType === "baddie"}
                    onChange={() => setAccountType("baddie")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Baddie
                </li>
              </ul>
            </div>

            {/* Wallet Balance Filter */}
            <div className="flex flex-col gap-2">
              <span className="">Wallet Balance</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="walletBalance"
                    value="0 - 50"
                    checked={walletBalance === "0 - 50"}
                    onChange={() => setWalletBalance("0 - 50")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  0 - 50
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="walletBalance"
                    value="51 - 100"
                    checked={walletBalance === "51 - 100"}
                    onChange={() => setWalletBalance("51 - 100")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  51 - 100
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="walletBalance"
                    value="101 - 150"
                    checked={walletBalance === "101 - 150"}
                    onChange={() => setWalletBalance("101 - 150")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  101 - 150
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="walletBalance"
                    value="> 200"
                    checked={walletBalance === "> 200"}
                    onChange={() => setWalletBalance("> 200")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  &gt; 200
                </li>
              </ul>
            </div>

            {/* Gender Filter */}
            <div className="flex flex-col gap-2">
              <span className="">Gender</span>
              <ul className="flex flex-col gap-2">
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Male
                </li>
                <li className="flex gap-1">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                    className="accent-purple-600 cursor-pointer"
                  />
                  Female
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
