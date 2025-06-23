"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataTable } from "@/components/DataTable";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function CampaignDashboard() {
  const [campaignData, setCampaignData] = useState();

  const fetchCampaign = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getCampaign", {
        userId: userId
      });
      setCampaignData(response.data.campaign);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error is occur");
      console.error('Error creating campaign:', error);
    }
  }, []);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <DataTable fetchCampaign={fetchCampaign} campaignData={campaignData} />
    </SidebarProvider>
  );
}