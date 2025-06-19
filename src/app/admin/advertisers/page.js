"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function Adversiters() {
  const [advertiserUser, setAdvertiserUser] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.post("/api/routes/v1/authRoutes?action=getAllUsers");
      if (response.data.success) {
        const usersWithDefaults = response.data.data.map(user => ({
          ...user,
          numOfAds: user.numOfAds || 0,
          totalSpent: user.totalSpent || 0,
          status: user.status || "active",
          dob: user.dob || user.createdAt || new Date()
        }));
        setAdvertiserUser(usersWithDefaults);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error is occur");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      label: "ADVERTISERS",
      key: "name",
      render: (advertiser) => (
        <div className="flex items-center gap-2">
          <Link
            href={{
              pathname: "/admin/advertisers-profile",
              query: { id: advertiser.userId },
            }}
            className="hover:underline"
          >
            {advertiser.name}
          </Link>
        </div>
      ),
    },
    { label: "BUSINESS EMAIL", key: "businessEmail" },
    { label: "BUSINESS WEBSITE", key: "businessWebsite" },
    { label: "PHONE", key: "phone" },
    { label: "COMPANY", key: "companyName" },
  ];

  const sortOptions = [
    {
      label: "A to Z",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (a.name || '').localeCompare(b.name || '')
      }
    },
    {
      label: "Z to A",
      value: (a, b) => {
        if (!a || !b) return 0;
        return (b.name || '').localeCompare(a.name || '')
      }
    },
  ];

  const filterOptions = {
    date: true,
    status: false,
    customStatusOptions: []
  };


  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        fetchData={fetchUsers}
        title="ADVERTISERS"
        data={advertiserUser}
        columns={columns}
        sortOptions={sortOptions}
        filterOptions={false}
        filters={{ dateKey: "dob", statusKey: "status" }}
      />
    </SidebarProvider>
  );
}
