"use client";

import { Suspense } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import { CheckCheck, EllipsisVertical, Pause, Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cookies from 'js-cookie';

// Wrap the component that uses useSearchParams in a Suspense boundary
function AdvertisersProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [userData, setUserData] = useState({ user: null, campaigns: [] });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "/api/routes/v1/authRoutes?action=getAllUserDataAgainstId",
          { userId: id }
        );

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const columns = [
    {
      label: "Title",
      key: "campaignTitle",
      render: (campaign) => (
        <Link
          href={{
            pathname: "/admin/campaign-overview",
            query: { id: campaign._id },
          }}
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <div>
            <div>{campaign.campaignTitle}</div>
            <div className="text-xs text-gray-500">{campaign.brandName || "No brand name"}</div>
          </div>
        </Link>
      ),
    },
    {
      label: "Total Views",
      key: "totalViews",
      render: (campaign) => `${campaign.totalViews}`,
    },
    {
      label: "Date",
      key: "createdAt",
      render: (campaign) => new Date(campaign.createdAt).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
      render: (campaign) => (
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${campaign.status === "Active"
            ? "bg-blue-100 text-blue-700"
            : campaign.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : campaign.status === "Rejected"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
        >
          {campaign.status}
        </span>
      ),
    },
    {
      label: "Budget",
      key: "campaignBudget",
      render: (campaign) => `$${campaign.campaignBudget}`
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.campaignTitle.localeCompare(b.campaignTitle) },
    { label: "Z to A", value: (a, b) => b.campaignTitle.localeCompare(a.campaignTitle) },
    { label: "Newest", value: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
    { label: "Oldest", value: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  ];

  const getProfileActions = (campaign) => {
    if (campaign.status === 'Completed') {
      return null;
    }

    const updateCampaignStatus = async (status, id) => {
      try {
        const response = await axios.post('/api/routes/v1/campaignRoutes?action=campaignStatusUpdate', {
          status,
          id: id || campaign._id,
          to: Cookies.get("userEmail")
        });

        if (response.status !== 200) {
          throw new Error(response.data.message || 'Failed to update status');
        }

        toast.success(`Campaign ${status.toLowerCase()} successfully`);
        fetchUserData();
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
            ) : campaign.status === 'Paused' ? (
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
            onClick={() => updateCampaignStatus('Completed', campaign._id)}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark as Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const headerProfile = userData.user && (
    <div className="p-5">
      <h1 className="text-gray-700">{userData.user.name}</h1>
      <p className="text-xs text-gray-500">
        Joining Date: {new Date(userData.user.createdAt).toLocaleDateString()}
      </p>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-2">
        <p className="text-sm text-blue-600">
          Status: <span className="text-gray-600">Active</span>
        </p>
        <p className="text-sm text-blue-600">
          Business Email:{" "}
          <span className="text-gray-600">{userData.user.businessEmail}</span>
        </p>
        <p className="text-sm text-blue-600">
          Business Website:{" "}
          <span className="text-gray-600">{userData.user.businessWebsite}</span>
        </p>
        <p className="text-sm text-blue-600">
          Ads Run: <span className="text-gray-600">{userData.campaigns.length}</span>
        </p>
        <p className="text-sm text-blue-600">
          Total Spent: <span className="text-gray-600">
            ${userData.campaigns.reduce((total, campaign) => total + Number(campaign.campaignBudget || 0), 0)}
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <GenericTablePage
      title="ALL CAMPAIGNS"
      data={userData.campaigns || []}
      columns={columns}
      sortOptions={sortOptions}
      filters={{
        dateKey: "createdAt",
        statusKey: "status",
        searchKeys: ["campaignTitle", "brandName", "status"]
      }}
      getActions={getProfileActions}
      showHeaderProfile={true}
      headerProfile={headerProfile}
      loading={loading}
    />
  );
}

export default function AdvertisersProfile() {
  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <Suspense fallback={<div>Loading...</div>}>
        <AdvertisersProfileContent />
      </Suspense>
    </SidebarProvider>
  );
}