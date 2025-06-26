"use client";

import Navbar from "../Navbar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RejectDialog from "@/components/RejectDialog";
import { toast } from "sonner";
import axios from "axios";
import { LineChart } from "./LineChart";
import { PieChartBox } from "./PieChart";

export function AdminDashboard() {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consumerUsers, setConsumerUsers] = useState([]);
  const [advertiserUsers, setAdvertiserUsers] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [latestCampaigns, setLatestCampaigns] = useState([]);

  const fetchConsumers = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=getConsumerUser"
      );
      setConsumerUsers(response?.data?.latestUsers || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching consumer users"
      );
      console.error("Error fetching consumer users:", error);
    }
  }, [setConsumerUsers]);

  const fetchAdvertiserUser = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=getLatestUsers"
      );
      setAdvertiserUsers(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching advertiser users"
      );
      console.error("Error fetching advertiser users:", error);
    }
  }, [setAdvertiserUsers]);

  const fetchDeletionRequest = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=getLatestPendingDeletionRequests"
      );
      setDeletionRequests(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching deletion requests"
      );
      console.error("Error fetching deletion requests:", error);
    }
  }, [setDeletionRequests]);

  const fetchLatestCampaign = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=getLatestPendingCampaign"
      );
      setLatestCampaigns(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error fetching latest campaigns"
      );
      console.error("Error fetching latest campaigns:", error);
    }
  }, [setLatestCampaigns]);

  useEffect(() => {
    fetchConsumers();
    fetchAdvertiserUser();
    fetchDeletionRequest();
    fetchLatestCampaign();
  }, [
    fetchConsumers,
    fetchAdvertiserUser,
    fetchDeletionRequest,
    fetchLatestCampaign,
  ]);

  const formatConsumerUsers = (users) => {
    return users.map((user) => ({
      id: user._id,
      userId: user._id,
      name: user.name,
      image: "User1.png",
      gender: user.gender || "Not specified",
      phone: user.phone,
      dob: user.dateOfBirth
        ? new Date(user.dateOfBirth).toLocaleDateString()
        : "Not specified",
      earnings: "$0",
      withdraw: "$0",
      isVerified: user.isVerified,
      isOtpVerified: user.isOtpVerified,
    }));
  };

  const formatAdvertiserUsers = (users) => {
    return users.map((user) => ({
      id: user._id,
      userId: user.userId,
      name: user.name,
      email: user.businessEmail,
      website: user.businessWebsite,
      ads: "0",
      spent: "$0",
      profileType: user.profileType || "Not specified",
      companyName: user.companyName || "Not specified",
      isOtpVerified: user.isOtpVerified,
    }));
  };

  const formatDeletionRequests = (requests) => {
    return requests
      .filter((req) => req.deletionRequest?.requested)
      .map((req) => ({
        id: req._id,
        userId: req.userId,
        name: req.name,
        email: req.businessEmail,
        userType: "Advertiser",
        createdAt: req.deletionRequest?.requestedAt || req.createdAt,
        reason: "Account deletion requested",
        status: req.deletionRequest?.status || "Pending",
      }));
  };

  const formatCampaigns = (campaigns) => {
    return campaigns.map((campaign) => ({
      id: campaign._id,
      campaignTitle: campaign.campaignTitle,
      websiteLink: campaign.websiteLink,
      status: campaign.status,
      genderType: campaign.genderType,
      genderRatio: campaign.genderRatio,
      campaignBudget: parseFloat(campaign.campaignBudget) || 0,
      campaignStartDate: campaign.campaignStartDate,
      campaignEndDate: campaign.campaignEndDate,
      createdAt: campaign.createdAt,
      brandName: campaign.brandName,
      quizQuestion: campaign.quizQuestion,
      ageRange: campaign.ageRange,
    }));
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
        toast.success(
          `Campaign ${
            action === "accept" ? "approved" : "rejected"
          } successfully`
        );
        fetchLatestCampaign();
      }
      return response.data;
    } catch (error) {
      console.error("Error updating campaign status:", error);
      toast.error(
        `Failed to ${action === "accept" ? "approve" : "reject"} campaign`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAdsApprovalActions = (campaign) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleCampaignAction(campaign.id, "accept")}
        className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
      >
        Accept
      </button>
      <button
        onClick={() => {
          setSelectedItem(campaign);
          setShowRejectDialog(true);
        }}
        className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
      >
        Reject
      </button>
    </div>
  );

  const userColumns = [
    {
      label: "USERS",
      key: "name",
      render: (item) => (
        <div className="flex items-center gap-2">
          <img
            src={`/${item.image}`}
            alt={item.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div>{item.name}</div>
            <div className="text-gray-500 text-xs">
              {item.gender} {item.isVerified && "✓"}
            </div>
          </div>
        </div>
      ),
    },
    { label: "PHONE NUMBER", key: "phone" },
    { label: "DOB", key: "dob" },
    { label: "TOTAL EARNINGS", key: "earnings" },
    { label: "TOTAL WITHDRAW", key: "withdraw" },
  ];

  const advertiserColumns = [
    { label: "ADVERTISER", key: "name" },
    { label: "BUSINESS EMAIL", key: "email" },
    {
      label: "BUSINESS WEBSITE",
      key: "website",
      render: (item) => (
        <a
          href={
            item.website.startsWith("http")
              ? item.website
              : `https://${item.website}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {item.website}
        </a>
      ),
    },
    { label: "COMPANY", key: "companyName" },
    { label: "PROFILE TYPE", key: "profileType" },
  ];

  const adsApprovalColumns = [
    {
      label: "CAMPAIGN TITLE",
      key: "campaignTitle",
      render: (item) => (
        <Link href="#" className="text-blue-600 hover:underline">
          {item.campaignTitle}
        </Link>
      ),
    },
    {
      label: "BRAND NAME",
      key: "brandName",
    },
    {
      label: "WEBSITE LINK",
      key: "websiteLink",
      render: (item) => (
        <a
          href={
            item.websiteLink.startsWith("http")
              ? item.websiteLink
              : `https://${item.websiteLink}`
          }
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
            item.status === "Approved"
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
      label: "AGE RANGE",
      key: "ageRange",
      render: (item) =>
        `${item.ageRange?.[0] || "N/A"} - ${item.ageRange?.[1] || "N/A"}`,
    },
    {
      label: "BUDGET",
      key: "campaignBudget",
      render: (item) => `$${item.campaignBudget.toLocaleString()}`,
    },
    {
      label: "DATES",
      key: "campaignStartDate",
      render: (item) => (
        <div className="flex flex-col">
          <span>
            {item.campaignStartDate
              ? new Date(item.campaignStartDate).toLocaleDateString()
              : "Not set"}
          </span>
          {item.campaignEndDate && (
            <>
              <span>to</span>
              <span>{new Date(item.campaignEndDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
      ),
    },
  ];

  const deleteRequestColumns = [
    {
      label: "USER",
      key: "name",
      render: (request) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{request.name}</div>
            <div className="text-gray-500 text-xs">{request.email}</div>
          </div>
        </div>
      ),
    },
    {
      label: "TYPE",
      key: "userType",
      render: (request) => (
        <span className="capitalize">{request.userType}</span>
      ),
    },
    {
      label: "REQUEST DATE",
      key: "createdAt",
      render: (request) => (
        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      label: "STATUS",
      key: "status",
      render: (request) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            request.status === "approved"
              ? "bg-green-100 text-green-800"
              : request.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {request.status || "pending"}
        </span>
      ),
    },
    {
      label: "REASON",
      key: "reason",
      render: (request) => (
        <span className="text-sm text-gray-600">{request.reason}</span>
      ),
    },
  ];

  const handleDeleteRequestAction = async (requestId, action, reason = "") => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=processDeletionRequest",
        {
          userId: requestId,
          action,
          reason,
        }
      );

      if (response.data.success) {
        toast.success(
          `Request ${
            action === "approve" ? "approved" : "rejected"
          } successfully`
        );
        fetchDeletionRequest();
        return { success: true };
      } else {
        throw new Error(response.data.message || "Action failed");
      }
    } catch (error) {
      toast.error(
        `Failed to ${action === "approve" ? "approve" : "reject"} request: ${
          error.message
        }`
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDeleteRequestActions = (request) => (
    <div className="flex gap-2">
      {request.status !== "approved" && request.status !== "rejected" && (
        <>
          <button
            onClick={() => handleDeleteRequestAction(request.id, "approve")}
            className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setSelectedItem(request);
              setShowRejectDialog(true);
            }}
            className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
          >
            Reject
          </button>
        </>
      )}
    </div>
  );

  return (
    <main className="flex h-auto min-h-screen w-full flex-col bg-[var(--bg-color-off-white)]">
    <Navbar mode="admin" />
  
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <div className="mb-4 flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="w-full lg:w-1/2 p-4 bg-white rounded-2xl">
          <LineChart />
        </div>
        <div className="w-full lg:w-1/2 p-4 bg-white rounded-2xl">
          <PieChartBox />
        </div>
      </div>
  
      <div className="w-full p-4 bg-white rounded-2xl">
        <GenericTablePage
          title="USERS"
          data={formatConsumerUsers(consumerUsers)}
          columns={userColumns}
          showHeaderAction
          compactLayout
          showHeaderProfile={false}
          fetchConsumers={fetchConsumers}
        />
      </div>
  
      <div className="w-full p-4 bg-white rounded-2xl">
        <GenericTablePage
          title="ADVERTISERS"
          data={formatAdvertiserUsers(advertiserUsers)}
          columns={advertiserColumns}
          showHeaderAction
          compactLayout
          showHeaderProfile={false}
          fetchAdvertiserUser={fetchAdvertiserUser}
        />
      </div>
  
      <div className="w-full p-4 bg-white rounded-2xl">
        <GenericTablePage
          title="ADS FOR APPROVAL"
          data={formatCampaigns(latestCampaigns)}
          columns={adsApprovalColumns}
          getActions={getAdsApprovalActions}
          loading={loading}
          showHeaderAction
          compactLayout
          showHeaderProfile={false}
        />
      </div>
  
      <div className="w-full p-4 bg-white rounded-2xl">
        <GenericTablePage
          title="ACCOUNT DELETE REQUESTS"
          data={formatDeletionRequests(deletionRequests)}
          columns={deleteRequestColumns}
          getActions={getDeleteRequestActions}
          loading={loading}
          showHeaderAction
          compactLayout
          showHeaderProfile={false}
        />
      </div>
    </div>
  
    <RejectDialog
      open={showRejectDialog}
      onClose={() => {
        setShowRejectDialog(false);
        setSelectedItem(null);
      }}
      onSave={async ({ reason }) => {
        if (selectedItem) {
          if (selectedItem.campaignTitle) {
            await handleCampaignAction(selectedItem.id, "reject", reason);
          } else {
            await handleDeleteRequestAction(selectedItem.id, "reject", reason);
          }
          setShowRejectDialog(false);
        }
      }}
    />
  </main>
  
  );
}
