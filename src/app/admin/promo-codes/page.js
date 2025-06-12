"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PromoCodes() {
  return (
    <SidebarProvider>
    <AppSidebar mode="admin" />
    {/* <DataTable fetchCampaign={fetchCampaign} campaignData={campaignData} /> */}
  </SidebarProvider>
  );
}