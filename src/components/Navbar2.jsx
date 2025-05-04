import Image from "next/image";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar2() {
  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">
      <Image src="/Aditt logo.jpg" alt="logo" width={100} height={100} />

      <div className="flex items-center space-x-4">
        {/* Notification Button */}
        <NotificationDropdown />


        {/* Profile Info with Image */}
        <div className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-2 px-4 rounded-[58px] hover:bg-blue-700 hover:text-white transition">
          <Image
            src="/navbar-image.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <Link href="/Settings">
              <div className="font-bold">Bongo digital</div>
              <p className="text-sm font-light">john@aditt.com</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
