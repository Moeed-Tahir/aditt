"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function NotificationDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userId = Cookies.get("userId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (showDropdown) {
      // Here you would typically fetch notifications from your API
      // For now, we'll simulate an empty response
      setLoading(true);
      setTimeout(() => {
        setNotifications([]); // Empty array simulates no notifications
        setLoading(false);
      }, 500);
    }
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
  className="relative"
  onClick={() => setShowDropdown(!showDropdown)}
>
  {/* Show text on small screens */}
  <span className="block md:hidden text-sm font-medium text-gray-700">Notifications</span>

  {/* Show bell icon on medium+ screens */}
  <svg
    className="hidden md:block w-6 h-6 text-gray-700"
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

  {notifications.length > 0 && (
    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
  )}
</button>


      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-xl shadow-xl z-50">
          <div className="p-4 border-b text-gray-700">Notifications</div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length > 0 ? (
            <ul>
              {/* Map through notifications here if they exist */}
              {notifications.map((notification) => (
                <li key={notification.id} className="px-4 py-3 hover:bg-blue-100 cursor-pointer">
                  {/* Notification content would go here */}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-6-6H9a6 6 0 00-6 6v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No notifications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                We'll notify you when something new arrives.
              </p>
            </div>
          )}

          {/* <hr className="border-t mb-2 border-gray-300" /> */}

          {/* <div className="flex justify-center p-2">
            <Link
              href={`/${userId}/campaign-dashboard`}
              className="w-full p-2 text-center rounded-full text-white bg-blue-600 text-sm hover:bg-blue-700 cursor-pointer"
            >
              View all notifications
            </Link>
          </div> */}
        </div>
      )}
    </div>
  );
}