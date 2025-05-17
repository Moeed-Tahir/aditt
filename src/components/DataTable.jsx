"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import Charts from "@/components/Charts";
import Link from "next/link";
import {
  Plus,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import CampaignMetricsDashboard from "./campaign-dashboard/CampaignMetricsDashboard";
import CampaignDataTable from "./campaign-dashboard/CampaignDataTable";
import FeedbackDialog from "./campaign-dashboard/FeedbackDialog";

export function DataTable({ campaignData, fetchCampaign }) {

  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const userId = Cookies.get("userId");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sliderValue, setSliderValue] = useState(5);
  const [currentCampaignId, setCurrentCampaignId] = useState(null);

  const transformedCampaigns = campaignData?.map((campaign) => ({
    id: campaign._id,
    title: campaign.campaignTitle,
    category: "No Category",
    views: campaign.totalViews || 0,
    date: campaign.campaignStartDate,
    amount: parseFloat(campaign.campaignBudget) || 0,
    status: campaign.status || "Pending",
  }));

  const filteredCampaigns = (transformedCampaigns || [])
    .filter((c) => {
      const statusMatch = statusFilter === "All" || c.status === statusFilter;
      let dateMatch = true;
      if (dateFilter.from || dateFilter.to) {
        const campaignDate = new Date(c.date);
        const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
        const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

        if (fromDate && campaignDate < fromDate) dateMatch = false;
        if (toDate && campaignDate > toDate) dateMatch = false;
      }

      return statusMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === "views_high_low") return b.views - a.views;
      if (sortBy === "views_low_high") return a.views - b.views;
      if (sortBy === "amount_high_low") return b.amount - a.amount;
      if (sortBy === "amount_low_high") return a.amount - b.amount;
      if (sortBy === "date_new_old")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date_old_new")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "a_z") return a.title.localeCompare(b.title);
      if (sortBy === "z_a") return b.title.localeCompare(a.title);
      return 0;
    });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    smallText: "",
    confirmLabel: "",
    onConfirm: () => { },
  });

  const openDialog = (title, smallText, confirmLabel, onConfirm) => {
    setDialogConfig({ title, smallText, confirmLabel, onConfirm });
    setDialogOpen(true);
  };

  const submitFeedback = async (campaignId, feedbackData) => {
    try {
      const response = await axios.post('/api/routes/v1/campaignRoutes?action=submitFeedback', {
        userId,
        campaignId,
        conversion: feedbackData.conversion,
        conversionType: feedbackData.conversionType,
        campaignRate: feedbackData.campaignRate,
        campaignFeedback: feedbackData.campaignFeedback,

      });

      if (!response.data.message) {
        throw new Error('Failed to submit feedback');
      }

      return await response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

const handleAction = (type, campaignId) => {
  setCurrentCampaignId(campaignId);
  
  const dialogTexts = {
    pause: {
      title: "Are you sure you want to pause this campaign?",
      smallText: "Pausing will temporarily stop your campaign from running.",
      confirmLabel: "Pause Campaign"
    },
    complete: {
      title: "Provide feedback for this completed campaign",
      smallText: "Please share your feedback to help us improve.",
      confirmLabel: "Continue to Feedback"
    },
    cancel: {
      title: "Are you sure you want to cancel this campaign?",
      smallText: "Canceling will permanently stop this campaign.",
      confirmLabel: "Cancel Campaign"
    }
  };

  if (type === "complete") {
    setDialogConfig({
      ...dialogTexts[type],
      onConfirm: () => {
        setDialogOpen(false);
        setFeedbackDialogOpen(true);
      },
    });
  } else {
    setDialogConfig({
      ...dialogTexts[type],
      onConfirm: () => {
        setDialogOpen(false);
      },
    });
  }
  setDialogOpen(true);
};



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setDateFilter({ from: "", to: "" });
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar userId={userId} />

        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-[30px] font-md">Campaigns</p>
            <Link
              href={`/${userId}/create-campaign`}
              className="w-full md:w-auto"
            >
              <button
                type="button"
                className="flex items-center justify-center gap-[12px] px-[28px] py-[16px] rounded-[80px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create new campaign</span>
              </button>
            </Link>
          </div>

          <CampaignMetricsDashboard transformedCampaigns={transformedCampaigns} />

          <CampaignDataTable setCurrentPage={setCurrentPage} currentPage={currentPage} fetchCampaign={fetchCampaign} handleAction={handleAction} openDialog={openDialog} campaignData={campaignData} totalPages={totalPages} filteredCampaigns={filteredCampaigns} paginatedCampaigns={paginatedCampaigns} resetFilters={resetFilters} statusFilter={statusFilter} dateFilter={dateFilter} />

          <Charts campaignData={transformedCampaigns} />
        </div>
      </main>
      <ConfirmationDialogue
        open={dialogOpen}
        title={dialogConfig.title}
        smallText={dialogConfig.smallText}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={() => {
          dialogConfig.onConfirm();
          setDialogOpen(false);
        }}
        onCancel={() => setDialogOpen(false)}
      />
      <FeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        feedback={feedback}
        setFeedback={setFeedback}
        campaignId={currentCampaignId}
        onSubmit={async (feedbackData) => {
          try {
            await submitFeedback(currentCampaignId, feedbackData);
            setFeedback("");
            setSliderValue(5);
            setFeedbackDialogOpen(false);
          } catch (error) {
            console.error("Failed to submit feedback:", error);
          }
        }}
      />
    </>
  );
}
