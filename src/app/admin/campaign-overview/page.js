"use client";

import { OverViewPage } from "@/components/admin/OverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CampaignOverViewContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return <OverViewPage id={id} />;
}

export default function CampaignOverView() {
  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <Suspense fallback={<div>Loading...</div>}>
        <CampaignOverViewContent />
      </Suspense>
    </SidebarProvider>
  );
}