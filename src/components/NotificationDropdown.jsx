"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full bg-[var(--bg-color-off-white)] hover:bg-gray-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-xl z-50">
          <div className="p-4 border-b text-gray-700">Notifications</div>
          <ul className="">
            <li className="px-4 py-3 hover:bg-blue-200 cursor-pointer">
              <p className="text-sm font-medium">Low Balance Alert ⚠️</p>
              <p className="text-xs text-gray-500">
                The balance for your campaign, [Campaign Title], is running low.
                Add funds now to avoid interruptions in its performance.
              </p>
              <p className="text-xs mt-2 text-gray-500">Today</p>
            </li>
            <hr className="border-t border-gray-300" />

            <li className="px-4 py-3 bg-blue-100 hover:bg-blue-200 cursor-pointer">
              <p className="text-sm font-medium">
                Congratulation your campaign has been published.
              </p>
              <p className="text-xs text-gray-500">
                Your campaign is now live and visible to your audience.{" "}
              </p>
              <p className="text-xs mt-1 text-gray-500">Today</p>
            </li>
            <hr className="border-t border-gray-300" />

            <li className="px-4 py-3 hover:bg-blue-200 cursor-pointer">
              <p className="text-sm font-medium">New Client Added ✅</p>
              <p className="text-xs text-gray-500">
                Your client, [Client Name], has been approved. You can now start
                creating campaigns for them.
              </p>
              <p className="text-xs mt-2 text-gray-500">Today</p>
            </li>
            <hr className="border-t border-gray-300" />

            <li className="px-4 py-3 hover:bg-blue-200 cursor-pointer">
              <p className="text-sm font-medium">Campaign Expired ⏳</p>
              <p className="text-xs text-gray-500">
                Your campaign [Campaign Title] has expired, but you still have
                an available budget. Update the dates or pause the campaign.
              </p>
              <p className="text-xs mt-2 text-gray-500">23 feb, 2025</p>
            </li>
          </ul>

          <hr className="border-t mb-2 border-gray-300" />

          <div className="flex justify-center p-2">
            <Link href="/Notifications" className="w-full p-2 text-center rounded-full text-white bg-blue-600 text-sm hover:bg-blue-700 cursor-pointer">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
