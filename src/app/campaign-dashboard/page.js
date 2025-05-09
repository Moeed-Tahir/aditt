"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataTable } from "@/components/DataTable";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CampaignDashboard() {
  const [campaignData, setCampaignData] = useState()
  const userId = localStorage.getItem("userId") || "abcdef";

  const fetchCampaign = async () => {
    try {

      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getCampaign", {
        userId:userId
      });

      setCampaignData(response.data.campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <DataTable campaignData={campaignData} />
    </SidebarProvider>
  );
}