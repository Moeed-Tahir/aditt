"use client"

import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Navbar({ userId }) {
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

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow px-4 md:px-6 py-3">
  <div className="flex justify-between items-center w-full md:w-auto mb-2 md:mb-0">
    <div className="text-[18px] md:text-[20px] font-md">
      Welcome, {user?.name || "User"} 👋
      <p className="text-[12px] md:text-[14px] text-gray-400">Good Morning</p>
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
    <div className="hidden md:flex items-center bg-[rgba(232,240,255,1)] text-gray-800 py-1 md:py-2 px-2 md:px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
      <Link href={`/${userId}/Settings`} className="flex items-center">
        <Image
          src="/navbar-image.png"
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full mr-2 md:mr-3 w-8 h-8 md:w-10 md:h-10"
        />
        <div>
          <div className="font-bold text-sm md:text-base">{user?.name}</div>
          <p className="text-xs md:text-sm font-light">{user?.email}</p>
        </div>
      </Link>
    </div>

    {/* Mobile dropdown menu */}
    {isMenuOpen && (
      <div className="md:hidden absolute right-4 top-20 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
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
</nav>

  );
}