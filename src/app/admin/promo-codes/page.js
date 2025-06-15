"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage"; // adjust path
import CampaignActionsDropdown from "@/components/campaign/CampaignActionsDropdown";
import { EllipsisVertical, Plus } from "lucide-react";
import PromoCodeDialog from "@/components/PromoCodeDialog";

const dummyData = [
  {
    _id: "1",
    name: "EARLYACCESS100",
    title: "FullWaiver",
    appliesTo: "New Signups",
    views: 1200,
    dateExpiry: "1992-03-21",
    value: 100,
    status: "Active",
  },
  {
    _id: "2",
    name: "EARLYACCESS100",
    title: "FullWaiver",
    appliesTo: "First 50 Users",
    views: 1500,
    dateExpiry: "1992-03-21",
    value: 100,
    status: "Paused",

  },

];

export default function PromoCodes() {
  const columns = [
    {
      label: "CODE NAME",
      key: "name",
      render: (promoCodes) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{promoCodes.name}</div>
          </div>
        </div>
      ),
    },
    { label: "DISCOUNT TYPE", key: "title" },
    { label: "VALUE", key: "value", render: (u) => `$${u.value}` },

    {
      label: "STATUS",
      key: "status",
      render: () => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      ),
    }
    ,

    {
      label: "APPLIES TO",
      key: "appliesTo",
    },
    {
      label: "EXPIRY",
      key: "dateExpiry",
      render: (promoCodes) => new Date(promoCodes.dateExpiry).toLocaleDateString(),
    },
    
    
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  const [openCreate, setOpenCreate] = useState(false);


  const getPromoActions = (totalCampaigns) => (
    <CampaignActionsDropdown
      customTrigger={<EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-600" />}
    />
  );
  const headerAction = (
    <button
      type="button"
      onClick={() => setOpenCreate(true)}
      className="flex items-center justify-center gap-[12px] px-[28px] py-[16px] rounded-[80px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer w-full md:w-auto"
    >
      <Plus className="w-5 h-5" />
      <span>Create Promo Code</span>
    </button>
  );
  

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
  
      <PromoCodeDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={(data) => {
          console.log("Saved promo code data:", data);
          setOpenCreate(false);
          // Optional: Update your table data
        }}
      />
  
      <GenericTablePage
        title="PROMO CODES"
        data={dummyData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getPromoActions}
        showHeaderAction={true}
        headerAction={headerAction}
      />
    </SidebarProvider>
  );
  
}
