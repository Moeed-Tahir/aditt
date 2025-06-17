"use client";

import { OverViewPage } from "@/components/admin/OverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";

export default function CampaignOverView() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <OverViewPage id={id}/>
      </SidebarProvider>
  );
}
