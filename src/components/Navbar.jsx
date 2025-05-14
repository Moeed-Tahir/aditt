"use client"

import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Navbar() {
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
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      <div className="text-[20px] font-md">
        Welcome, {user?.name || "User"} 👋
        <p className="text-[14px] text-gray-400">Good Morning</p>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationDropdown />

        <div className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-2 px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
          <Image
            src="/navbar-image.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <Link href="/settings">
              <div className="font-bold">Bongo digital</div>
              <p className="text-sm font-light">{user?.email}</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}