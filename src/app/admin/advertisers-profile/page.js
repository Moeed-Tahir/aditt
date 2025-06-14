"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage"; // adjust path
import { EllipsisVertical } from "lucide-react";
import CampaignActionsDropdown from "@/components/campaign/CampaignActionsDropdown";
import { useSearchParams } from "next/navigation";

const dummyData = [
  {
    _id: "1",
    title: "Nike Campaign",
    categories: "Entertainment and Technology",
    dob: "1985-09-12",
    totalViews: "03",
    totalSpent: "150",
    status: "Active",
  },
  {
    _id: "2",
    title: "Adidas Campaign",
    categories: "Food and Drink",
    dob: "1985-09-12",
    totalViews: "05",
    totalSpent: "250",
    status: "Completed",
  },

  {
    _id: "3",
    title: "Nike Campaign",
    categories: "Entertainment and Technology",
    dob: "1985-09-12",
    totalViews: "03",
    totalSpent: "150",
    status: "Active",
  },
  {
    _id: "4",
    title: "Adidas Campaign",
    categories: "Food and Drink",
    dob: "1985-09-12",
    totalViews: "05",
    totalSpent: "250",
    status: "Pending",
  },
];

export default function AdversitersProfile() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const columns = [
    {
      label: "Title",
      key: "title",
      render: (adverstisersProfile) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{adverstisersProfile.title}</div>
          </div>
        </div>
      ),
    },
    { label: "Categories", key: "categories" },
    {
      label: "Total Views",
      key: "totalViews",
      render: (u) => `${u.totalViews}k`,
    },
    {
      label: "DOB",
      key: "dob",
      render: (user) => new Date(user.dob).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
      render: (c) => (
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            c.status === "Active"
              ? "bg-blue-100 text-blue-700"
              : c.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {c.status}
        </span>
      ),
    },
    { label: "Budget", key: "totalSpent", render: (u) => `$${u.totalSpent}` },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  const getProfileActions = (adverstisersProfile) => (
    <CampaignActionsDropdown
      customTrigger={
        <EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-600" />
      }
    />
  );

  const headerProfile = (
    <div>
      <h1 className="text-gray-700">{name}</h1>

      <p className="text-xs text-gray-500">{name}</p>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-2">
  <p className="text-sm text-blue-600">
    Status: <span className="text-gray-600">Active</span>
  </p>
  <p className="text-sm text-blue-600">
    Business Email: <span className="text-gray-600">business@gmail.com</span>
  </p>
  <p className="text-sm text-blue-600">
    Business Website: <span className="text-gray-600">www.business.com</span>
  </p>
  <p className="text-sm text-blue-600">
    Ads Run: <span className="text-gray-600">10</span>
  </p>
  <p className="text-sm text-blue-600">
    Total Spent: <span className="text-gray-600">$500</span>
  </p>
</div>

    </div>
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
        getActions={getProfileActions}
        showHeaderProfile={true}
        headerProfile={headerProfile}
      />
    </SidebarProvider>
  );
}
