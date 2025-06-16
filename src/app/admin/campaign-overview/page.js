"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { OverViewPage } from "@/components/admin/OverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CampaignOverView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Option 1: Use search param like ?view=adsApproval
  const view = searchParams.get("view");

  // Option 2 (optional): Or use pathname to decide
  // const isAdsApproval = pathname.includes("adsApproval");

  const showPerformance = view !== "adsApproval"; // only show if not adsApproval

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <OverViewPage variant={view === "adsApproval" ? "ads" : "campaign"} />
      </SidebarProvider>
  );
}
