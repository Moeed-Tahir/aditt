"use client";

import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Navbar({ userId = "", mode = "" }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = () => {
    Cookies.remove("email");
    Cookies.remove("Role");
    window.location.href = "/signin-user";
  };

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow px-4 md:px-6 py-3">
      <div className="flex justify-between items-center w-full md:w-auto mb-2 md:mb-0">
        <div className="text-[18px] md:text-[20px] font-md">
          Welcome, {user?.name || "Admin"} 👋
          <p className="text-[12px] md:text-[14px] text-gray-400">
            Good Morning
          </p>
        </div>

        {/* Image on right side of welcome line */}
        <div className="md:hidden ml-4">
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
        </div>
      </div>

      <div className="flex items-center justify-end w-full md:w-auto">
        <div className="hidden md:block mr-4">
          <NotificationDropdown />
        </div>

        {/* Desktop image with name and email */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center bg-[rgba(232,240,255,1)] text-gray-800 py-1 md:py-2 px-2 md:px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
            <Link href={`/${userId}/settings`} className="flex items-center">
              <Image
                src="/navbar-image.png"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full mr-2 md:mr-3 w-8 h-8 md:w-10 md:h-10"
              />
              <div>
                <div className="font-bold text-sm md:text-base">{user?.name || "Admin"}</div>
                <p className="text-xs md:text-sm font-light">{user?.email || "admin123@gmail.com"} </p>
              </div>
            </Link>
          </div>
          {mode === "admin" && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          )}

        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute right-4 top-20 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-900">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin123@gmail.com"}</p>
            </div>
            <Link
              href={`/${userId}/campaign-dashboard`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <div className="px-4 py-2">
              <NotificationDropdown mobileView />
            </div>
            <Link
              href={`/${userId}/settings`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            {mode === "admin" && (
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}