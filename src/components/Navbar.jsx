"use client"

import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Navbar({userId}) {
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

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow px-4 md:px-6 py-3">
      <div className="text-[18px] md:text-[20px] font-md mb-2 md:mb-0">
        Welcome, {user?.name || "User"} 👋
        <p className="text-[12px] md:text-[14px] text-gray-400">Good Morning</p>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-normal">
        <NotificationDropdown />

        <div className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-1 md:py-2 px-2 md:px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
          <Image
            src="/navbar-image.png"
            alt="logo"
            width={32}
            height={32}
            className="rounded-full mr-2 md:mr-3 w-8 h-8 md:w-10 md:h-10"
          />
          <div>
            <Link href={`/${userId}/Settings`}>
              <div className="font-bold text-sm md:text-base">{user?.name}</div>
              <p className="text-xs md:text-sm font-light">{user?.email}</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}