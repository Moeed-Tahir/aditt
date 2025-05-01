import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white shadow px-6 py-3">

      <div className="text-xl font">Welcome, John 👋
        <p className="text-sm text-gray-400">Good Morning</p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notification Button */}
        <button className="relative p-2 rounded-full bg-[var(--bg-color-off-white)] hover:bg-gray-100">
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

        {/* Profile Info with Image */}
        <div className="flex items-center bg-[var(--bg-color-off-white)] text-gray-800 py-2 px-4 rounded-[58px] hover:bg-blue-700 transition">
          <Image
            src="/navbar-image.png"
            alt="logo"
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <div className="font-bold">Bongo digital</div>
            <p className="text-sm font-light">john@aditt.com</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
