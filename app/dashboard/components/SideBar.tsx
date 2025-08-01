import React, { useState, useCallback, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import { MdEventNote, MdPayments, MdMenu, MdClose } from "react-icons/md";
import Footer from "./Footer";

interface MenuItem {
  name: string;
  label: string;
  icon: React.ReactNode;
}

interface SideBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SideBar: React.FC<SideBarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Memoized menu items to prevent unnecessary re-renders
  const menuItems: MenuItem[] = React.useMemo(
    () => [
      { name: "users", label: "Manage Users", icon: <FaUsers size={20} /> },
      {
        name: "events",
        label: "Manage Events",
        icon: <MdEventNote size={20} />,
      },
      {
        name: "payments",
        label: "Manage Tx's",
        icon: <MdPayments size={20} />,
      },
    ],
    []
  );

  // Optimized toggle function
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle menu item selection
  const handleMenuItemClick = useCallback(
    (itemName: string) => {
      setActiveTab(itemName);
      setIsOpen(false); // Close mobile menu after selection
    },
    [setActiveTab]
  );

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, closeSidebar]);

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white p-3 rounded-full shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-screen w-72 bg-gradient-to-b from-purple-600 via-purple-500 to-white shadow-2xl transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:w-64 md:shadow-none md:rounded-tr-3xl md:rounded-br-3xl
        `}
        aria-hidden={!isOpen && "true"}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav
            className="flex-1 flex items-center justify-center"
            role="navigation"
            aria-label="Main navigation"
          >
            <ul className="flex flex-col gap-8 py-8 px-6 w-full max-w-xs">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    className={`w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-300
                      ${
                        activeTab === item.name
                          ? "bg-white/20 text-white shadow-lg transform scale-105 font-semibold"
                          : "text-white/90 hover:bg-white/10 hover:text-white hover:transform hover:scale-102"
                      }
                    `}
                    onClick={() => handleMenuItemClick(item.name)}
                    aria-current={activeTab === item.name ? "page" : undefined}
                  >
                    <span
                      className={`transition-transform duration-200 ${
                        activeTab === item.name
                          ? "scale-110"
                          : "group-hover:scale-105"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4">
            <Footer />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default SideBar;
