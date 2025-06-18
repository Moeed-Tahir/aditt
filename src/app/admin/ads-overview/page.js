"use client";

import { AdsOverview } from "@/components/admin/AdsOverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CampaignOverView() {
  const searchParams = useSearchParams();
  const [campaignData, setCampaignData] = useState(null);
  
  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(dataParam);
        setCampaignData(parsedData);
      } catch (error) {
        console.error("Error parsing campaign data:", error);
      }
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <AdsOverview campaignData={campaignData} />
    </SidebarProvider>
  );
}
