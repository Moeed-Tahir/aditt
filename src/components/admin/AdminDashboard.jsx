"use client";

import Navbar from "../Navbar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import Link from "next/link";

export function AdminDashboard() {
  // Dummy data for Users
  const usersData = [
    {
      id: "u1",
      userId: "u1",
      name: "Marvin Ramos",
      gender: "Male",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$500",
      withdraw: "$150",
    },
    {
      id: "u2",
      userId: "u2",
      name: "May Lloyd",
      gender: "Female",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$800",
      withdraw: "$250",
    },
    {
      id: "u3",
      userId: "u3",
      name: "Julia Schuster",
      gender: "Female",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$1000",
      withdraw: "$500",
    },
  ];

  const userColumns = [
    {
      label: "USERS",
      key: "name",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-gray-500 text-sm">{item.gender}</span>
        </div>
      ),
    },
    { label: "PHONE NUMBER", key: "phone" },
    { label: "DOB", key: "dob" },
    { label: "TOTAL EARNINGS", key: "earnings" },
    { label: "TOTAL WITHDRAW", key: "withdraw" },
  ];

  // Dummy data for Advertisers
  const advertisersData = [
    {
      id: "a1",
      userId: "a1",
      name: "Marvin Ramos",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "03",
      spent: "$150",
    },
    {
      id: "a2",
      userId: "a2",
      name: "May Lloyd",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "05",
      spent: "$250",
    },
    {
      id: "a3",
      userId: "a3",
      name: "Julia Schuster",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "15",
      spent: "$500",
    },
  ];

  const advertiserColumns = [
    { label: "ADVERTISER", key: "name" },
    { label: "BUSINESS EMAIL", key: "email" },
    { label: "BUSINESS WEBSITE", key: "website" },
    { label: "NUM OF ADS", key: "ads" },
    { label: "TOTAL SPENT", key: "spent" },
  ];

  return (
    <main className="flex h-auto min-h-screen w-full flex-col bg-[var(--bg-color-off-white)]">
      <Navbar />

      <div className="p-4 sm:p-6 lg:p-8 space-y-0"> {/* Changed space-y-2 to space-y-0 */}
        {/* USERS TABLE */}
        <div className="mb-4"> {/* Added margin-bottom only */}
          <GenericTablePage
            title="USERS"
            data={usersData}
            columns={userColumns}
            showHeaderAction
            compactLayout
            showHeaderProfile={false}
            headerAction={
              <Link href="/admin/users" className="text-blue-600 hover:underline">
                See All
              </Link>
            }
          />
        </div>

        {/* ADVERTISERS TABLE */}
        <div> {/* Wrapped in div for consistency */}
          <GenericTablePage
            title="ADVERTISERS"
            data={advertisersData}
            columns={advertiserColumns}
            showHeaderAction
            compactLayout
            showHeaderProfile={false}
            headerAction={
              <Link
                href="/admin/ads-approval"
                className="text-blue-600 hover:underline"
              >
                See All
              </Link>
            }
          />
        </div>
      </div>
    </main>
  );
}