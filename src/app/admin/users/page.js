"use client";

import { UsersPage } from "@/components/admin/UsersPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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


export default function Users() {
  return (
    <SidebarProvider>
    <AppSidebar mode="admin" />
    <UsersPage campaignData={dummyData} />
    </SidebarProvider>
  );
}