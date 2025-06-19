"use client";

import { AdsOverview } from "@/components/admin/AdsOverviewPage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CampaignOverViewContent() {
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

  return <AdsOverview campaignData={campaignData} />;
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