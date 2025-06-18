"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";

const dummyData = [
  {
    _id: "1",
    name: "John Doe",
    image: "User1.png",
    gender: "Male",
    phoneNumber: "+123456789",
    dob: "1990-05-01",
    totalEarning: 1200,
    totalWithdrawal: 800,
  },
  {
    _id: "2",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "+987654321",
    dob: "1985-09-12",
    totalEarning: 1500,
    totalWithdrawal: 900,
  },
  {
    _id: "3",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "+1122334455",
    dob: "1992-03-21",
    totalEarning: 2000,
    totalWithdrawal: 1700,
  },
];

const columns = [
  {
    label: "USER",
    key: "name",
    render: (user) => (
      <div className="flex items-center gap-2">
        <img
          src={`/${user.image}`}
          alt={user.name}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <div>{user.name}</div>
          <div className="text-xs text-gray-500">{user.gender}</div>
        </div>
      </div>
    ),
  },
  { label: "PHONE NUMBER", key: "phoneNumber" },
  {
    label: "DOB",
    key: "dob",
    render: (user) => new Date(user.dob).toLocaleDateString("en-GB"),
  },
  {
    label: "TOTAL EARNING",
    key: "totalEarning",
    render: (u) => `$${u.totalEarning}`,
  },
  {
    label: "TOTAL WITHDRAWAL",
    key: "totalWithdrawal",
    render: (u) => `$${u.totalWithdrawal}`,
  },
];

const sortOptions = [
  { 
    label: "A to Z", 
    value: (a, b) => {
      if (!a || !b) return 0;
      return (a.name || '').localeCompare(b.name || '')
    } 
  },
  { 
    label: "Z to A", 
    value: (a, b) => {
      if (!a || !b) return 0;
      return (b.name || '').localeCompare(a.name || '')
    } 
  },
];

// ✅ Reusable Component
export function UsersTable({ minimal = false }) {
  return (
    <GenericTablePage
      title="USERS"
      data={dummyData}
      columns={columns}
      sortOptions={sortOptions}
      filters={{ dateKey: "dob", statusKey: "status" }}
      showHeaderAction={!minimal}
    />
  );
}

// ✅ Page Route
export default function UsersPage() {
  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <UsersTable />
    </SidebarProvider>
  );
}
