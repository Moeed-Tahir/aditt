"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RejectDialog from "@/components/RejectDialog";
import { toast } from "sonner";

export default function AdsApproval() {
  const [loading, setLoading] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const router = useRouter();

  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=getPendingCampaign"
      );
      setApprovalData(response.data.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to fetch campaigns");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignAction = async (campaignId, action, reason = "") => {
    try {
      setLoading(true);
      const payload = {
        id: campaignId,
        status: action === "accept" ? "Active" : "Rejected",
      };
      
      if (action === "reject" && reason) {
        payload.reason = reason;
      }

      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=activeOrRejectCampaign",
        payload
      );

      if (response.data.success) {
        toast.success(`Campaign ${action === "accept" ? "approved" : "rejected"} successfully`);
        fetchApprovalData();
      }
      return response.data;
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error(`Failed to ${action === "accept" ? "approve" : "reject"} campaign`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      label: "CAMPAIGN TITLE",
      key: "campaignTitle",
      render: (item) => (
        <Link
          href={{
            pathname: "/admin/ads-overview",
            query: { data: JSON.stringify(item) },
          }}
          className="text-blue-600 hover:underline"
        >
          {item.campaignTitle}
        </Link>
      ),
    },
    {
      label: "WEBSITE LINK",
      key: "websiteLink",
      render: (item) => (
        <a
          href={item.websiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {item.websiteLink}
        </a>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            item.status === "Active"
              ? "bg-green-100 text-green-800"
              : item.status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      label: "GENDER TARGETING",
      key: "genderType",
      render: (item) => `${item.genderType} (${item.genderRatio}%)`,
    },
    {
      label: "BUDGET",
      key: "campaignBudget",
      render: (item) => `$${item.campaignBudget}`,
    },
    {
      label: "DATES",
      key: "campaignStartDate",
      render: (item) => (
        <div className="flex flex-col">
          <span>{new Date(item.campaignStartDate).toLocaleDateString()}</span>
          <span>to</span>
          <span>{new Date(item.campaignEndDate).toLocaleDateString()}</span>
        </div>
      ),
    },
  ];

  const sortOptions = [
    {
      label: "A to Z",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (a.name || '').localeCompare(b.name || '');
      },
    },
    {
      label: "Z to A",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (b.name || '').localeCompare(a.name || '');
      },
    },
  ];

  const getAdsApprovalActions = (campaign) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleCampaignAction(campaign._id, "accept")}
        className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
      >
        Accept
      </button>
      <button
        onClick={() => {
          setSelectedCampaign(campaign);
          setShowRejectDialog(true);
        }}
        className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
      >
        Reject
      </button>
      <button
        onClick={() => router.push(`/admin/campaigns/${campaign._id}`)}
        className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
      >
        View
      </button>
    </div>
  );

  useEffect(() => {
    fetchApprovalData();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ADS FOR APPROVAL"
        data={approvalData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getAdsApprovalActions}
        loading={loading}
      />
      <RejectDialog
        open={showRejectDialog}
        onClose={() => {
          setShowRejectDialog(false);
          setSelectedCampaign(null);
        }}
        onSave={async ({ reason }) => {
          if (selectedCampaign) {
            await handleCampaignAction(selectedCampaign._id, "reject", reason);
          }
        }}
      />
    </SidebarProvider>
  );
}