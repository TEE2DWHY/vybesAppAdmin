import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import Footer from "./Footer";

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, setActiveTab }) => {
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
    <div className="relative w-[16%]">
      <ul className="flex flex-col  bg-gradient-to-t from-white to-purple-600 h-[100vh] rounded-tr-[20px] rounded-br-[20px] items-center justify-center gap-12">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`text-base cursor-pointer flex items-center gap-2 ${
              activeTab === item.name ? "text-purple-800" : "text-white "
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            {item.icon} {item.label}
          </li>
        ))}
      </ul>
      <Footer />
    </div>
  );
};

export default SideBar;
