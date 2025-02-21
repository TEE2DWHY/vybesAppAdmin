import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { CiFilter } from "react-icons/ci";
import { FaAngleLeft, FaChevronRight } from "react-icons/fa6";

const Payments = () => {
  const [txType, setTxType] = useState<string | null>("All");
  const [inputCoinPrice, setInputCoinPrice] = useState<number>(50);
  const [finalCoinPrice, setFinalCoinPrice] = useState<number>(50);
  const transactions = [
    {
      id: 1,
      user: "User1",
      amountInCoins: 6000,
      type: "Purchase",
      date: "2025-02-15",
    },
    {
      id: 2,
      user: "User2",
      amountInCoins: 9000,
      type: "Purchase",
      date: "2025-02-17",
    },
    {
      id: 3,
      user: "User3",
      amountInCoins: 15000,
      type: "Conversion",
      date: "2025-02-19",
    },
    {
      id: 4,
      user: "User4",
      amountInCoins: 10000,
      type: "Conversion",
      date: "2025-03-19",
    },
    {
      id: 5,
      user: "User5",
      amountInCoins: 8000,
      type: "Transfer",
      date: "2024-08-19",
    },
  ];

  const [pagination, setPagination] = useState(1);

  const totalTransactionAmountInCoins = transactions.reduce(
    (sum, transaction) => sum + transaction.amountInCoins,
    0
  );

  const totalTransactionAmountInNaira = totalTransactionAmountInCoins;

  const updateCoinPrice = () => {
    if (inputCoinPrice === 0) {
      return alert("Price cannot be zero");
    }
    setFinalCoinPrice(inputCoinPrice);
  };

  return (
    <>
      <div className="w-[84%] px-4 py-5 h-screen overflow-y-scroll">
        <div className="border border-gray-300 py-2 px-8 rounded-xl">
          <div>
            <h1 className="text-3xl border-b border-gray-200 pb-2 font-bold">
              Payments
            </h1>
          </div>
          <div className="my-4 flex gap-8">
            <div className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
              <div>
                <h1 className="text-3xl text-white">{transactions.length}</h1>
                <h4 className="capitalize text-white">
                  No of Total Transactions
                </h4>
              </div>
            </div>
            <div className="rounded-md bg-gradient-to-r from-green-500 to-green-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
              <div>
                <h1 className="text-3xl text-white">
                  {totalTransactionAmountInNaira}
                </h1>
                <h4 className="capitalize text-white">Total in Naira</h4>
              </div>
            </div>
            <div className="rounded-md bg-gradient-to-r from-yellow-500 to-yellow-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
              <div>
                <h1 className="text-3xl text-white">{finalCoinPrice}</h1>
                <h4 className="capitalize text-white">
                  Current Vyber Coin Price (₦)
                </h4>
              </div>
            </div>
            <div className="rounded-md bg-gradient-to-r from-pink-500 to-pink-700 py-8 px-4 w-[23%] shadow-lg flex items-center gap-8">
              <div>
                <h1 className="text-3xl text-white">4</h1>
                <h4 className="capitalize text-white">
                  No of Transacting Users
                </h4>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-0 border-t border-gray-300">
            <ul className="flex gap-10 text-base">
              <li
                className={`${
                  txType === "All"
                    ? "text-purple-500 font-bold"
                    : "text-[#BFBFBF]"
                } cursor-pointer`}
                onClick={() => setTxType("All")}
              >
                All
              </li>
              <li
                className={`${
                  txType === "Transfer"
                    ? "text-purple-500 font-bold"
                    : "text-[#BFBFBF]"
                } cursor-pointer`}
                onClick={() => setTxType("Transfer")}
              >
                Transfer
              </li>
              <li
                className={`${
                  txType === "Conversion"
                    ? "text-purple-500 font-bold"
                    : "text-[#BFBFBF]"
                } cursor-pointer`}
                onClick={() => setTxType("Conversion")}
              >
                Conversion
              </li>
            </ul>
            <div className="flex gap-10 items-center justify-end mt-6">
              <form className="flex gap-3 items-center p-2 rounded-md w-[280px] bg-[#F3F4F6]">
                <label htmlFor="submit">
                  <IoMdSearch size={24} className="text-black cursor-pointer" />
                </label>
                <input
                  type="text"
                  placeholder="Search For Tx By TxId"
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
          <div className="my-2">
            <h3 className="">Set Vyber Coin Price (₦):</h3>
            <input
              type="text"
              value={inputCoinPrice}
              onChange={(e) => setInputCoinPrice(Number(e.target.value))}
              className="mt-2 p-2 border border-gray-300 rounded-md outline-none"
              required
            />
            <button
              onClick={updateCoinPrice}
              className="ml-4 p-2 bg-purple-600 text-white rounded-md"
            >
              Update Coin Price
            </button>
          </div>
          <div className="my-6">
            <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-tl-xl rounded-tr-xl">
              <thead className="text-left bg-purple-500 ">
                <tr>
                  <th className="pl-4 text-white py-5">User</th>
                  <th className="pl-4 text-white py-5">Amount (Coins)</th>
                  <th className="pl-4 text-white py-5">Amount (₦)</th>
                  <th className="pl-4 text-white py-5">Type</th>
                  <th className="pl-4 text-white py-5">Date</th>
                </tr>
              </thead>
              <tbody className="bg-purple-50">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200">
                    <td className="pl-4 py-3">{transaction.user}</td>
                    <td className="pl-4 py-3">{transaction.amountInCoins}</td>
                    <td className="pl-4 py-3">{transaction.amountInCoins}</td>
                    <td className="pl-4 py-3">{transaction.type}</td>
                    <td className="pl-4 py-3">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="flex justify-center items-center gap-6 mt-5">
              <FaAngleLeft
                size={16}
                color="#1b1b1b"
                cursor={"pointer"}
                onClick={() =>
                  setPagination((prev) => (prev <= 1 ? 1 : prev - 1))
                }
              />
              {[1, 2, 3, 4, 5].map((page) => (
                <li
                  key={page}
                  className={`${
                    pagination === page ? "bg-purple-500" : "bg-gray-500"
                  } rounded-md text-white px-3 py-1 cursor-pointer`}
                  onClick={() => setPagination(page)}
                >
                  {page}
                </li>
              ))}
              <FaChevronRight
                size={16}
                color="#1b1b1b"
                cursor={"pointer"}
                onClick={() =>
                  setPagination((prev) => (prev >= 5 ? 5 : prev + 1))
                }
              />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
