import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Navbar2({ userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-white shadow px-4 py-3 w-full">
      {/* Logo on the left */}
      <div className="flex items-center">
        <Image
          src="/Aditt logo.jpg"
          alt="logo"
          width={100}
          height={100}
          className="w-20 md:w-[100px] h-auto"
        />
      </div>

      {/* Profile and Notifications on the right */}
      <div className="relative flex items-center gap-4">
        {/* Desktop Notification + Profile */}
        <div className="hidden md:flex items-center gap-4">
          <NotificationDropdown />
          <Link
            href={`/${userId}/Settings`}
            className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-2 px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition"
          >
            <Image
              src="/navbar-image.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full w-8 h-8 mr-3"
            />
            <div className="text-left">
              <div className="font-bold text-sm md:text-base">{user?.name}</div>
              <p className="text-xs md:text-sm font-light">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* Mobile Profile Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Image
              src="/navbar-image.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full w-8 h-8"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <div className="px-4 py-2">
                <NotificationDropdown mobileView />
              </div>
              <Link
                href={`/${userId}/Settings`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
