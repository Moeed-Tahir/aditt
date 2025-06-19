"use client";

import Navbar from "../Navbar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import Link from "next/link";
import { useState } from "react";
import RejectDialog from "@/components/RejectDialog";
import { toast } from "sonner";

export function AdminDashboard() {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dummy data for Ads Approval
  const adsApprovalData = [
    {
      id: "ad1",
      campaignTitle: "Summer Sale 2023",
      websiteLink: "www.example.com/summer-sale",
      status: "Pending",
      genderType: "Female",
      genderRatio: 70,
      campaignBudget: 5000,
      campaignStartDate: "2023-06-01",
      campaignEndDate: "2023-08-31",
      createdAt: "2023-05-15",
    },
    {
      id: "ad2",
      campaignTitle: "New Product Launch",
      websiteLink: "www.techgadgets.com/new",
      status: "Pending",
      genderType: "All",
      genderRatio: 100,
      campaignBudget: 10000,
      campaignStartDate: "2023-07-01",
      campaignEndDate: "2023-09-30",
      createdAt: "2023-05-20",
    },
    {
      id: "ad3",
      campaignTitle: "Back to School",
      websiteLink: "www.education.com/back-to-school",
      status: "Pending",
      genderType: "Male",
      genderRatio: 60,
      campaignBudget: 7500,
      campaignStartDate: "2023-08-15",
      campaignEndDate: "2023-09-15",
      createdAt: "2023-05-25",
    },
  ];

  const adsApprovalColumns = [
    {
      label: "CAMPAIGN TITLE",
      key: "campaignTitle",
      render: (item) => (
        <Link
          href="#"
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
          href={`https://${item.websiteLink}`}
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
      render: (item) => `$${item.campaignBudget.toLocaleString()}`,
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


  const handleCampaignAction = async (campaignId, action, reason = "") => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Campaign ${action === "accept" ? "approved" : "rejected"} successfully`);
      return { success: true };
    } catch (error) {
      toast.error(`Failed to ${action === "accept" ? "approve" : "reject"} campaign`);
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
          setSelectedCampaign(campaign);
          setShowRejectDialog(true);
        }}
        className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
      >
        Reject
      </button>
    </div>
  );

  // Dummy data for Users
  const usersData = [
    {
      id: "u1",
      userId: "u1",
      name: "Marvin Ramos",
      image: "User1.png",
      gender: "Male",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$500",
      withdraw: "$150",
    },
    {
      id: "u2",
      userId: "u2",
      name: "May Lloyd",
      image: "User2.png",
      gender: "Female",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$800",
      withdraw: "$250",
    },
    {
      id: "u3",
      userId: "u3",
      name: "Julia Schuster",
      image: "User2.png",
      gender: "Female",
      phone: "+12 123 4567890",
      dob: "05/22/2000",
      earnings: "$1000",
      withdraw: "$500",
    },
  ];

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
            <div className="text-gray-500 text-xs">{item.gender}</div>
          </div>
        </div>
      ),
    },
    { label: "PHONE NUMBER", key: "phone" },
    { label: "DOB", key: "dob" },
    { label: "TOTAL EARNINGS", key: "earnings" },
    { label: "TOTAL WITHDRAW", key: "withdraw" },
  ];

  // Dummy data for Advertisers
  const advertisersData = [
    {
      id: "a1",
      userId: "a1",
      name: "Marvin Ramos",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "03",
      spent: "$150",
    },
    {
      id: "a2",
      userId: "a2",
      name: "May Lloyd",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "05",
      spent: "$250",
    },
    {
      id: "a3",
      userId: "a3",
      name: "Julia Schuster",
      email: "business@gmail.com",
      website: "www.business.com",
      ads: "15",
      spent: "$500",
    },
  ];

  const advertiserColumns = [
    { label: "ADVERTISER", key: "name" },
    { label: "BUSINESS EMAIL", key: "email" },
    { label: "BUSINESS WEBSITE", key: "website" },
    { label: "NUM OF ADS", key: "ads" },
    { label: "TOTAL SPENT", key: "spent" },
  ];


  // Dummy data for Account Delete Requests
  const deleteRequestsData = [
    {
      id: "del1",
      userId: "u1",
      name: "Marvin Ramos",
      email: "marvin@example.com",
      userType: "Advertiser",
      createdAt: "2023-05-10",
      reason: "Closing my business",
    },
    {
      id: "del2",
      userId: "u2",
      name: "May Lloyd",
      email: "may@example.com",
      userType: "User",
      createdAt: "2023-05-15",
      reason: "No longer using the platform",
    },
    {
      id: "del3",
      userId: "a1",
      name: "Tech Gadgets Inc",
      email: "contact@techgadgets.com",
      userType: "Advertiser",
      createdAt: "2023-05-20",
      reason: "Switching to another platform",
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
      )
    },
    { 
      label: "REQUEST DATE", 
      key: "createdAt",
      render: (request) => (
        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
      )
    },
    {
      label: "REASON",
      key: "reason",
      render: (request) => (
        <span className="text-sm text-gray-600">{request.reason}</span>
      )
    }
  ];

  const handleDeleteRequestAction = async (requestId, action, reason = "") => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Request ${action === "approve" ? "approved" : "rejected"} successfully`);
      return { success: true };
    } catch (error) {
      toast.error(`Failed to ${action === "approve" ? "approve" : "reject"} request`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDeleteRequestActions = (request) => (
    <div className="flex gap-2">
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
    </div>
  );

  return (
    <main className="flex h-auto min-h-screen w-full flex-col bg-[var(--bg-color-off-white)]">
      <Navbar />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        {/* USERS TABLE */}
        <div className="mb-4">
          <GenericTablePage
            title="USERS"
            data={usersData}
            columns={userColumns}
            showHeaderAction
            compactLayout
            showHeaderProfile={false}
          />
        </div>

        {/* ADVERTISERS TABLE */}
        <div className="mb-4">
          <GenericTablePage
            title="ADVERTISERS"
            data={advertisersData}
            columns={advertiserColumns}
            showHeaderAction
            compactLayout
            showHeaderProfile={false}
          />
        </div>

        {/* ADS APPROVAL TABLE */}
        <div>
          <GenericTablePage
            title="ADS FOR APPROVAL"
            data={adsApprovalData}
            columns={adsApprovalColumns}
            getActions={getAdsApprovalActions}
            loading={loading}
            showHeaderAction
            compactLayout
            showHeaderProfile={false}
          />
        </div>

        <div className="mb-4">
          <GenericTablePage
            title="ACCOUNT DELETE REQUESTS"
            data={deleteRequestsData}
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
          setSelectedCampaign(null);
        }}
        onSave={async ({ reason }) => {
          if (selectedCampaign) {
            await handleCampaignAction(selectedCampaign.id, "reject", reason);
            setShowRejectDialog(false);
          }
        }}
      />
    </main>
  );
}