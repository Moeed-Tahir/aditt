"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage"; // adjust path
import Link from "next/link";

const dummyData = [
  {
    _id: "1",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "2",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "3",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "4",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "5",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "6",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "7",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "8",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "9",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "10",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "11",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "12",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
];

export default function Adversiters() {
  const columns = [
    {
      label: "ADVERTISERS",
      key: "name",
      render: (adverstisers) => (
        <div className="flex items-center gap-2">
          <Link
            href={{
              pathname: "/admin/advertisers-profile",
              query: { name: adverstisers.name },
            }}
            className="hover:underline"
          >
            {adverstisers.name}
          </Link>
        </div>
      ),
    },
    { label: "BUSINESS EMAIL", key: "businessEmail" },
    {
      label: "BUSINESS WEBSITE",
      key: "businessWebsite",
    },
    { label: "NUM OF ADS", key: "numOfAds", render: (u) => `${u.numOfAds}` },
    {
      label: "TOTAL SPENT",
      key: "totalSpent",
      render: (u) => `$${u.totalSpent}`,
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ADVERTISERS"
        data={dummyData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
      />
    </SidebarProvider>
  );
}
