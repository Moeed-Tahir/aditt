"use client";

import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeLimit, setActiveLimit] = useState(0);
  const [currentActiveCount, setCurrentActiveCount] = useState(0);
  const [currentWaitlistCount, setCurrentWaitlistCount] = useState(0);
  const [editedLimit, setEditedLimit] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [waitlistUsers, setWaitlistUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/routes/v1/adminUserRoutes?action=getAllUsersController");
      
      const data = response.data.data;
      
      setActiveUsers(data.activeUsers || []);
      setWaitlistUsers(data.waitlistUsers || []);
      setActiveLimit(data.activeUserLimit || 0);
      setCurrentActiveCount(data.currentActiveCount || 0);
      setCurrentWaitlistCount(data.currentWaitlistCount || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching users");
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserLimit = async (newLimit) => {
    try {
      const response = await axios.post("/api/routes/v1/adminUserRoutes?action=updateActiveUserLimitController", { newLimit });
      const data = response.data.data;
      
      setActiveUsers(data.activeUsers || []);
      setWaitlistUsers(data.waitlistUsers || []);
      setActiveLimit(data.activeUserLimit || 0);
      setCurrentActiveCount(data.currentActiveCount || 0);
      setCurrentWaitlistCount(data.currentWaitlistCount || 0);
      
      toast.success("Active user limit updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update limit");
      console.error('Error updating limit:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveLimit = () => {
    updateUserLimit(editedLimit);
    setShowLimitModal(false);
  };

  const dataToShow = activeTab === "active" ? activeUsers : waitlistUsers;

  const columns = [
    {
      label: "USER",
      key: "name",
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image
              width={32}
              height={32}
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div>
            <div>{user.name || "No Name"}</div>
            <div className="text-xs text-gray-500">{user.companyName || user.profileType || "Not specified"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "EMAIL",
      key: "businessEmail",
      render: (user) => user.businessEmail || "N/A"
    },
    {
      label: "COMPANY",
      key: "companyName",
      render: (user) => user.companyName || "N/A",
    },
    {
      label: "WEBSITE",
      key: "businessWebsite",
      render: (user) => user.businessWebsite || "N/A",
    },
    {
      label: "TYPE",
      key: "profileType",
      render: (user) => (
        <span className="font-medium capitalize">
          {user.profileType || "N/A"}
        </span>
      ),
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => (a.name || "").localeCompare(b.name || "") },
    { label: "Z to A", value: (a, b) => (b.name || "").localeCompare(a.name || "") },
    { label: "Newest First", value: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
    { label: "Oldest First", value: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
  ];

  const headerAction = (
    <div className="flex flex-col gap-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2 rounded p-1 text-sm font-semibold w-full max-w-md">
        <button
          className={`flex-1 py-2 px-4 rounded-full ${activeTab === "active"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center`}
          onClick={() => setActiveTab("active")}
        >
          Active Users ({currentActiveCount})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-full ${activeTab === "waitlist"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center`}
          onClick={() => setActiveTab("waitlist")}
        >
          Waitlist ({currentWaitlistCount})
        </button>
      </div>

      {activeTab === "active" && (
        <div className="bg-white shadow-sm rounded-xl px-6 py-4 w-full flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-[22px] font-semibold text-gray-800">
              Active Users Limit: {activeLimit} ({currentActiveCount} active)
            </p>
            <p className="text-sm text-gray-500">
              Total users: {currentActiveCount + currentWaitlistCount}
            </p>
          </div>
          <button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditedLimit(activeLimit);
              setShowLimitModal(true);
            }}
            className="py-2 px-5 rounded-full bg-blue-600 text-white border border-blue-800 hover:bg-blue-800 transition flex items-center gap-2 justify-center"
          >
            Edit Active Limit
          </button>
        </div>
      )}

      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Edit Active Users Limit
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">New Limit</label>
            <input
              type="number"
              value={editedLimit}
              onChange={(e) => setEditedLimit(Number(e.target.value))}
              className="w-full border border-input rounded-full px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              min={0}
            />
            <div className="flex justify-between gap-2 w-full">
              <button
                variant="outline"
                className="py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2 w-1/2 justify-center"
                onClick={() => setShowLimitModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLimit}
                className="py-2 px-5 rounded-full bg-blue-600 text-white border border-blue-800 hover:bg-blue-800 transition flex items-center gap-2 w-1/2 justify-center"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const filterOptions = {
    date: true,
    status: false,
    customStatusOptions: [],
  };

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="USERS"
        data={dataToShow}
        columns={columns}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        filters={{ dateKey: "createdAt" }}
        headerAction={headerAction}
        showHeaderAction={true}
        loading={loading}
      />
    </SidebarProvider>
  );
}