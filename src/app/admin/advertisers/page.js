"use client";

import { AdvertisersPage } from "@/components/admin/Advertisers";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const dummyData = [
  {
    _id: "1",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "2",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "3",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "4",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "5",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "6",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "7",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "8",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "9",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
  {
    _id: "10",
    name: "Marvin Ramos",
    image: "User1.png",
    gender: "Male",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "11",
    name: "Jane Smith",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "05",
    totalSpent: "250",
  },
  {
    _id: "12",
    name: "Alice Johnson",
    image: "User2.png",
    gender: "Female",
    phoneNumber: "business@gmail.com",
    email: "www.business.com",
    numOfAds: "15",
    totalSpent: "500",
  },
];


export default function Advertisers() {
  return (
    <SidebarProvider>
    <AppSidebar mode="admin" />
    <AdvertisersPage campaignData={dummyData} />
    </SidebarProvider>
  );
}