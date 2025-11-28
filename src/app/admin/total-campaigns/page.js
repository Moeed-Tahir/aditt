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
import Cookies from "js-cookie";

export default function TotalCampaigns() {
  const [totalCampaign, setTotalCampaign] = useState([]);

  const fetchAllCampaign = useCallback(async () => {
    try {
      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getAllCampaign", {});

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

  // Calculate verified responses (attentive engagement)
  const calculateVerifiedResponses = (campaign) => {
    // Sum of all quiz question option stats
    let totalResponses = 0;
    
    if (campaign.quizQuestion && campaign.quizQuestion.optionStats) {
      const optionStats = campaign.quizQuestion.optionStats;
      totalResponses += (optionStats.option1?.totalCount || 0);
      totalResponses += (optionStats.option2?.totalCount || 0);
      totalResponses += (optionStats.option3?.totalCount || 0);
      totalResponses += (optionStats.option4?.totalCount || 0);
    }

    // Add survey question responses if they exist
    if (campaign.surveyQuestion1 && campaign.surveyQuestion1.optionStats) {
      const survey1Stats = campaign.surveyQuestion1.optionStats;
      totalResponses += (survey1Stats.option1?.totalCount || 0);
      totalResponses += (survey1Stats.option2?.totalCount || 0);
      totalResponses += (survey1Stats.option3?.totalCount || 0);
      totalResponses += (survey1Stats.option4?.totalCount || 0);
    }

    if (campaign.surveyQuestion2 && campaign.surveyQuestion2.optionStats) {
      const survey2Stats = campaign.surveyQuestion2.optionStats;
      totalResponses += (survey2Stats.option1?.totalCount || 0);
      totalResponses += (survey2Stats.option2?.totalCount || 0);
      totalResponses += (survey2Stats.option3?.totalCount || 0);
      totalResponses += (survey2Stats.option4?.totalCount || 0);
    }

    return totalResponses;
  };

  // Calculate remaining budget (you might need to adjust this based on your business logic)
  const calculateRemainingBudget = (campaign) => {
    // This is a simplified calculation - adjust based on your actual spending logic
    const spentBudget = campaign.totalViews * 0.1; // Example: $0.10 per view
    const remaining = campaign.campaignBudget - spentBudget;
    return Math.max(0, remaining).toFixed(2);
  };

  const columns = [
    {
      label: "TITLE",
      key: "campaignTitle",
      render: (campaign) => (
        <Link
          href={{
            pathname: "/admin/campaign-overview",
            query: { id: campaign._id },
          }}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {campaign.campaignTitle}
        </Link>
      ),
    },
    {
      label: "TOTAL VERIFIED RESPONSES",
      key: "verifiedResponses",
      render: (campaign) => calculateVerifiedResponses(campaign),
    },
    {
      label: "TOTAL BUDGET",
      key: "campaignBudget",
      render: (campaign) => `$${campaign.campaignBudget?.toFixed(2) || "0.00"}`,
    },
    {
      label: "REMAINING BUDGET",
      key: "remainingBudget",
      render: (campaign) => `$${calculateRemainingBudget(campaign)}`,
    },
    {
      label: "DATE",
      key: "campaignEndDate",
      render: (campaign) => new Date(campaign.campaignEndDate).toLocaleDateString(),
    },
    {
      label: "STATUS",
      key: "status",
      render: (campaign) => (
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            campaign.status === "Active"
              ? "bg-green-100 text-green-700"
              : campaign.status === "Paused"
              ? "bg-yellow-100 text-yellow-700"
              : campaign.status === "Completed"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {campaign.status}
        </span>
      ),
    }
  ];

  const sortOptions = [
    {
      label: "A to Z",
      value: (a, b) => (a.campaignTitle || '').localeCompare(b.campaignTitle || ''),
    },
    {
      label: "Z to A",
      value: (a, b) => (b.campaignTitle || '').localeCompare(a.campaignTitle || ''),
    },
    {
      label: "Highest Budget",
      value: (a, b) => (b.campaignBudget || 0) - (a.campaignBudget || 0),
    },
    {
      label: "Lowest Budget",
      value: (a, b) => (a.campaignBudget || 0) - (b.campaignBudget || 0),
    },
    {
      label: "Most Responses",
      value: (a, b) => calculateVerifiedResponses(b) - calculateVerifiedResponses(a),
    },
    {
      label: "Least Responses",
      value: (a, b) => calculateVerifiedResponses(a) - calculateVerifiedResponses(b),
    },
    {
      label: "Newest First",
      value: (a, b) => new Date(b.campaignEndDate) - new Date(a.campaignEndDate),
    },
    {
      label: "Oldest First",
      value: (a, b) => new Date(a.campaignEndDate) - new Date(b.campaignEndDate),
    },
  ];

  const filterOptions = {
    date: true,
    status: true,
    customStatusOptions: ["Active", "Completed", "Paused", "Pending"],
  };

  const getCampaignsActions = (campaign) => {
    if (campaign.status === "Completed") {
      return null;
    }

    const updateCampaignStatus = async (status, id) => {
      try {
        const response = await axios.post(
          "/api/routes/v1/campaignRoutes?action=campaignStatusUpdate",
          {
            status,
            id: id || campaign._id,
            to: Cookies.get("userEmail"),
          }
        );

        if (response.status !== 200) {
          throw new Error(response.data.message || "Failed to update status");
        }

        toast.success(`Campaign ${status.toLowerCase()} successfully`);
        fetchAllCampaign();
        return response.data;
      } catch (error) {
        console.error("Error updating campaign status:", error);
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
            onClick={() =>
              updateCampaignStatus(
                campaign.status === "Active" ? "Paused" : "Active",
                campaign._id
              )
            }
          >
            {campaign.status === "Active" ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : campaign.status === "Paused" ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Unpause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateCampaignStatus("Completed", campaign._id)}
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