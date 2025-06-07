import React, { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { MdEventNote, MdPayments, MdMenu } from "react-icons/md";
import Footer from "./Footer";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "users", label: "Manage Users", icon: <FaUsers size={22} /> },
    { name: "events", label: "Manage Events", icon: <MdEventNote size={22} /> },
    {
      name: "payments",
      label: "Manage Payments",
      icon: <MdPayments size={22} />,
    },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MdMenu size={24} />
      </button>

      <div
        className={`fixed z-40 top-0 left-0 sm:h-[100vh] h-full bg-gradient-to-t from-white to-purple-600 rounded-tr-[20px] rounded-br-[20px] transition-transform duration-300 ease-in-outs
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:w-[16%] md:flex`}
      >
        <ul className="flex flex-col h-full w-full items-center justify-center gap-12 py-10 px-4 md:px-0">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`text-base cursor-pointer flex items-center gap-2 p-0 m-0 ${
                activeTab === item.name ? "text-purple-800" : "text-white"
              }`}
              onClick={() => {
                setActiveTab(item.name);
                setIsOpen(false);
              }}
            >
              {item.icon} {item.label}
            </li>
          ))}
        </ul>
        <Footer />
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
