"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage"; // adjust path
import CampaignActionsDropdown from "@/components/campaign/CampaignActionsDropdown";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

const dummyData = [
  {
    _id: "1",
    name: "John Doe",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1200,
    dateExpiry: "1992-03-21",
    budget: 800,
    status: "Active",
  },
  {
    _id: "2",
    name: "Jane Smith",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1500,
    dateExpiry: "1992-03-21",
    budget: 900,
    status: "Paused",
  },
  {
    _id: "3",
    name: "Alice Johnson",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 2000,
    dateExpiry: "1992-03-21",
    budget: 1700,
    status: "Completed",
  },
  {
    _id: "4",
    name: "John Doe",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1200,
    dateExpiry: "1992-03-21",
    budget: 800,
    status: "Completed",
  },
  {
    _id: "5",
    name: "Jane Smith",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1500,
    dateExpiry: "1992-03-21",
    budget: 900,
    status: "Paused",
  },
  {
    _id: "6",
    name: "Alice Johnson",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 2000,
    dateExpiry: "1992-03-21",
    budget: 1700,
    status: "Completed",
  },
  {
    _id: "7",
    name: "John Doe",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1200,
    dateExpiry: "1992-03-21",
    budget: 800,
    status: "Active",
  },
  {
    _id: "8",
    name: "Jane Smith",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1500,
    dateExpiry: "1992-03-21",
    budget: 900,
    status: "Completed",
  },
  {
    _id: "9",
    name: "Alice Johnson",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 2000,
    dateExpiry: "1992-03-21",
    budget: 1700,
    status: "Paused",
  },
  {
    _id: "10",
    name: "John Doe",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1200,
    dateExpiry: "1992-03-21",
    budget: 800,
    status: "Active",
  },
  {
    _id: "11",
    name: "Jane Smith",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1500,
    dateExpiry: "1992-03-21",
    budget: 900,
    status: "Paused",
  },
  {
    _id: "12",
    name: "Alice Johnson",
    image: "User2.png",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 2000,
    dateExpiry: "1992-03-21",
    budget: 1700,
    status: "Completed",
  },
  {
    _id: "13",
    name: "John Doe",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1200,
    dateExpiry: "1992-03-21",
    budget: 800,
    status: "Active",
  },
  {
    _id: "14",
    name: "Jane Smith",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 1500,
    dateExpiry: "1992-03-21",
    budget: 900,
    status: "Paused",
  },
  {
    _id: "15",
    name: "Alice Johnson",
    businessEmail: "business@gmail",
    title: "Adidas Campaign",
    businessWebsite: "www.link.com",
    views: 2000,
    dateExpiry: "1992-03-21",
    budget: 1700,
    status: "Completed",
  },
];

export default function TotalCampaigns() {
  const columns = [
    {
      label: "ALL CAMPAIGNS",
      key: "name",
      render: (totalCampaigns) => (
        <div className="flex items-center gap-2">
          <div>
            <Link
              href={{
                pathname: "/admin/campaign-overview",
                query: { name: totalCampaigns.name },
              }}
            >
              {totalCampaigns.name}
            </Link>
            <div className="text-xs text-gray-500">
              {totalCampaigns.businessEmail}
            </div>
          </div>
        </div>
      ),
    },
    { label: "CAMPAIGN TITLE", key: "title" },
    {
      label: "LINK",
      key: "businessWebsite",
    },
    { label: "VIEWS", key: "views", render: (u) => `${u.views}` },
    {
      label: "EXPIRY DATE",
      key: "dateExpiry",
      render: (totalCampaigns) =>
        new Date(totalCampaigns.dateExpiry).toLocaleDateString(),
    },
    { label: "BUDGET", key: "budget", render: (u) => `$${u.budget}` },

    {
      label: "STATUS",
      key: "status",
      render: (c) => (
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            c.status === "Active"
              ? "bg-green-100 text-green-700"
              : c.status === "Paused"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {c.status}
        </span>
      ),
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  const getCampaignsActions = (totalCampaigns) => (
    <CampaignActionsDropdown
      customTrigger={
        <EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-600" />
      }
    />
  );

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ALL CAMPAIGNS"
        data={dummyData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getCampaignsActions}
      />
    </SidebarProvider>
  );
}
