"use client";

import { OverViewPage } from "@/components/admin/OverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Adversiters() {
 
  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <OverViewPage/>
    </SidebarProvider>
  );
}
