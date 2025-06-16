"use client";

import { AdsOverview } from "@/components/admin/AdsOverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CampaignOverView() {

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <AdsOverview/>
      </SidebarProvider>
  );
}
