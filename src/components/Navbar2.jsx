import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar2() {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-white shadow px-4 md:px-6 py-3 gap-4 md:gap-0">
      {/* Logo - centered on mobile, aligned left on desktop */}
      <div className="w-full md:w-auto flex justify-center md:justify-start">
        <Image 
          src="/Aditt logo.jpg" 
          alt="logo" 
          width={100} 
          height={100}
          className="w-20 md:w-[100px] h-auto"
        />
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 w-full md:w-auto justify-between md:justify-normal">
        {/* Notification Button */}
        <NotificationDropdown />

        {/* Profile Info with Image */}
        <div className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-1 md:py-2 px-2 md:px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
          <Image
            src="/navbar-image.png"
            alt="profile"
            width={32}
            height={32}
            className="rounded-full mr-2 md:mr-3 w-8 h-8 md:w-10 md:h-10"
          />
          <div>
            <Link href="/settings">
              <div className="font-bold text-sm md:text-base">Bongo digital</div>
              <p className="text-xs md:text-sm font-light">john@aditt.com</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}