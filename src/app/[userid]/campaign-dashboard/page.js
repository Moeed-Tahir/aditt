"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataTable } from "@/components/DataTable";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export default function CampaignDashboard() {
  const [campaignData, setCampaignData] = useState(null);
  const [allCampaignStats, setAllCampaignStats] = useState(null);

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

  const fetchCampaignsStats = useCallback(async () => {
    try {
      const userId = Cookies.get("userId");
      const response = await axios.post("/api/routes/v1/campaignRoutes?action=totalCampaignsStat", {
        userId
      });
      setAllCampaignStats(response.data); // ✅ save stats response
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching stats");
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchCampaign();
    fetchCampaignsStats();
  }, [fetchCampaign, fetchCampaignsStats]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <DataTable fetchCampaign={fetchCampaign} campaignData={campaignData} campaignStats={allCampaignStats} />
    </SidebarProvider>
  );
}