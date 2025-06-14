"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage"; // adjust path
import CampaignActionsDropdown from "@/components/campaign/CampaignActionsDropdown";

const dummyData = [
  {
    _id: "1",
    name: "Marvin Ramos",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "2",
    name: "Jane Smith",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "250",
  },
  {
    _id: "3",
    name: "Alice Johnson",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "500",
  },
  {
    _id: "4",
    name: "Marvin Ramos",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "5",
    name: "Jane Smith",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "250",
  },
  {
    _id: "6",
    name: "Alice Johnson",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "500",
  },
  {
    _id: "7",
    name: "Marvin Ramos",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "8",
    name: "Jane Smith",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "250",
  },
  {
    _id: "9",
    name: "Alice Johnson",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "500",
  },
  {
    _id: "10",
    name: "Marvin Ramos",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "150",
  },
  {
    _id: "11",
    name: "Jane Smith",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "250",
  },
  {
    _id: "12",
    name: "Alice Johnson",
    businessEmail: "business@gmail.com",
    businessWebsite: "www.business.com",
    numOfAds: "03",
    totalSpent: "500",
  },
];

export default function AccountDeleteRequests() {
  const columns = [
    {
      label: "ADVERTISERS",
      key: "name",
      render: (accountDelete) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{accountDelete.name}</div>
          </div>
        </div>
      ),
    },
    { label: "BUSINESS EMAIL", key: "businessEmail" },
    {
      label: "BUSINESS WEBSITE",
      key: "businessWebsite",
    },
    {
      label: "NUM OF ADS",
      key: "numOfAds",
      render: (u) => `${u.totalSpent}`,
    },
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

  const getAdsApprovalActions = (adsApproval) => (
    <div className="flex gap-2">
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
        Accept
      </span>
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700">
        Reject
      </span>
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
        View
      </span>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ACCOUNT DELETE REQUESTS"
        data={dummyData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getAdsApprovalActions}
      />
    </SidebarProvider>
  );
}
