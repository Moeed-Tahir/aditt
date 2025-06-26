"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { EllipsisVertical, Play, Pause, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function TotalCampaigns() {
  const [totalCampaign, setTotalCampaign] = useState([]);

  const fetchAllCampaign = useCallback(async () => {
    try {
      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getAllCampaign",{

      });
      
      if (response.data.message === "Campaigns retrieved successfully") {
        setTotalCampaign(response.data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  }, [setTotalCampaign]);

  useEffect(() => {
    fetchAllCampaign();
  }, [fetchAllCampaign]);

  const columns = [
    {
      label: "ADVERTISERS",
      key: "userId",
      render: (campaign) => (
        <div className="flex items-center gap-2">
          <div>
            <Link
              href={{
                pathname: "/admin/campaign-overview",
                query: { id: campaign._id },
              }}
            >
              {campaign.campaignTitle}
            </Link>
            <div className="text-xs text-gray-500">
              {campaign.websiteLink}
            </div>
          </div>
        </div>
      ),
    },
    { label: "CAMPAIGN TITLE", key: "campaignTitle" },
    {
      label: "LINK",
      key: "websiteLink",
    },
    { label: "VIEWS", key: "totalViews", render: (u) => `${u.totalViews}` },
    {
      label: "EXPIRY DATE",
      key: "campaignEndDate",
      render: (campaign) =>
        new Date(campaign.campaignEndDate).toLocaleDateString(),
    },
    { label: "BUDGET", key: "campaignBudget", render: (u) => `$${u.campaignBudget}` },
    {
      label: "STATUS",
      key: "status",
      render: (c) => (
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${c.status === "Active"
              ? "bg-green-100 text-green-700"
              : c.status === "Paused"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
        >
          {c.status}
        </span>
      ),
    },
  ];

  const sortOptions = [
    {
      label: "A to Z",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (a.campaignTitle || '').localeCompare(b.campaignTitle || '');
      }
    },
    {
      label: "Z to A",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (b.campaignTitle || '').localeCompare(a.campaignTitle || '');
      }
    },
    {
      label: "Highest Budget",
      value: (a, b) => (b.campaignBudget || 0) - (a.campaignBudget || 0)
    },
    {
      label: "Lowest Budget",
      value: (a, b) => (a.campaignBudget || 0) - (b.campaignBudget || 0)
    },
    {
      label: "Newest First",
      value: (a, b) => new Date(b.campaignEndDate) - new Date(a.campaignEndDate)
    },
    {
      label: "Oldest First",
      value: (a, b) => new Date(a.campaignEndDate) - new Date(b.campaignEndDate)
    }
  ];

  // Custom filter options for this page
  const filterOptions = {
    date: true,
    status: true,
    customStatusOptions: ["Active", "Completed", "Paused"]
  };

  const getCampaignsActions = (campaign) => {
    if (campaign.status === 'Completed') {
      return null;
    }

    const updateCampaignStatus = async (status, id) => {
      try {
        const response = await axios.post('/api/routes/v1/campaignRoutes?action=campaignStatusUpdate', {
          status,
          id: id || campaign._id
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to update status');
        }

        toast.success(`Campaign ${status.toLowerCase()} successfully`);
        fetchAllCampaign();
        return response.data;
      } catch (error) {
        console.error('Error updating campaign status:', error);
        toast.error(error?.response?.data?.message || "Error occurred");
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => updateCampaignStatus(
              campaign.status === 'Active' ? 'Paused' : 'Active',
              campaign._id
            )}
          >
            {campaign.status === 'Active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateCampaignStatus('Completed', campaign._id)}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark as Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ALL CAMPAIGNS"
        data={totalCampaign}
        columns={columns}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        filters={{ dateKey: "campaignEndDate", statusKey: "status" }}
        getActions={getCampaignsActions}
      />
    </SidebarProvider>
  );
}