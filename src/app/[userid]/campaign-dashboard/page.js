"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataTable } from "@/components/DataTable";

export default function CampaignDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <DataTable />
    </SidebarProvider>
  );
}