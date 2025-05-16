import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import { useState } from "react";

export default function Navbar2({ userId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-white shadow px-4 md:px-6 py-3 gap-4 md:gap-0">
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <Image
          src="/Aditt logo.jpg"
          alt="logo"
          width={100}
          height={100}
          className="w-20 md:w-[100px] h-auto"
        />
      </div>

      <div className="flex items-center justify-end w-full md:w-auto relative">
        <div className="hidden md:block mr-4">
          <NotificationDropdown />
        </div>

        <div className="hidden md:flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-1 md:py-2 px-2 md:px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
          <Link href={`/${userId}/Settings`} className="flex items-center">
            <Image
              src="/navbar-image.png"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full mr-2 md:mr-3 w-8 h-8 md:w-10 md:h-10"
            />
            <div>
              <div className="font-bold text-sm md:text-base">
                Bongo digital
              </div>
              <p className="text-xs md:text-sm font-light">john@aditt.com</p>
            </div>
          </Link>
        </div>

        <div className="md:hidden relative">
          <button
            onClick={toggleMenu}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            <div className="hidden md:block mr-4">
              <NotificationDropdown />
            </div>

            <Image
              src="/navbar-image.png"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full w-8 h-8 md:w-10 md:h-10"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  Bongo digital
                </p>
                <p className="text-xs text-gray-500 truncate">john@aditt.com</p>
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
