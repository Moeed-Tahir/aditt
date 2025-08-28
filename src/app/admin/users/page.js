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
  const [userLimit, setUserLimit] = useState(0);
  const [editedLimit, setEditedLimit] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const limitResponse = await axios.post("/api/routes/v1/adminDashboardRoutes?action=getUserLimit");
      setUserLimit(limitResponse.data.userLimit || 0);
      setEditedLimit(limitResponse.data.userLimit || 0);

      const usersResponse = await axios.post("/api/routes/v1/authRoutes?action=listAllConsumerUsers");
      setUsers(usersResponse.data.data || []);

    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching data");
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = async (userId, newStatus) => {
    try {
      await axios.post("/api/routes/v1/authRoutes?action=updateUserStatus", {
        userId,
        status: newStatus
      });
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      return false;
    }
  };

  const updateUserLimit = async (newLimit) => {
    try {
      const limitResponse = await axios.post(
        "/api/routes/v1/adminDashboardRoutes?action=updateUserLimit",
        { newUserLimit: newLimit }
      );

      const updatedLimit = limitResponse.data.userLimit;
      setUserLimit(updatedLimit);
      setEditedLimit(updatedLimit);

      const sortedUsers = [...users].sort((a, b) => {
        if (a.status === b.status) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return a.status === "active" ? -1 : 1;
      });

      const usersToUpdate = [];
      let activeCount = 0;

      for (const user of sortedUsers) {
        if (activeCount < updatedLimit) {
          if (user.status !== "active") {
            usersToUpdate.push({ ...user, newStatus: "active" });
          }
          activeCount++;
        } else {
          if (user.status !== "waitlist") {
            usersToUpdate.push({ ...user, newStatus: "waitlist" });
          }
        }
      }

      if (usersToUpdate.length > 0) {
        const updatePromises = usersToUpdate.map(user =>
          updateUserStatus(user._id, user.newStatus)
        );

        await Promise.all(updatePromises);
        await fetchData();
      }

      toast.success("User limit updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update limit");
      console.error('Error updating limit:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveLimit = () => {
    updateUserLimit(editedLimit);
    setShowLimitModal(false);
  };

  const activeUsers = users
    .filter(user => user.status === "active")
    .slice(0, userLimit);

  const waitlistUsers = [
    ...users.filter(user => user.status === "waitlist"),
    ...users
      .filter(user => user.status === "active")
      .slice(userLimit)
  ];

  const currentActiveCount = activeUsers.length;
  const currentWaitlistCount = waitlistUsers.length;

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
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div>
            <div>{`${user.fullName}` || "No Name"}</div>
            <div className="text-xs text-gray-500">{user.email || "No email"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "DATE OF BIRTH",
      key: "dateOfBirth",
      render: (user) => user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A",
    },
    {
      label: "TOTAL EARNINGS",
      key: "totalBalance",
      render: (user) => `$${(user.totalBalance || 0).toFixed(2)}`,
    },
    {
      label: "TOTAL WITHDRAW",
      key: "totalWithdraw",
      render: (user) => `$${(user.totalWithdraw || 0).toFixed(2)}`,
    },
    {
      label: "STATUS",
      key: "status",
      render: (user) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" && activeUsers.includes(user)
          ? "bg-green-100 text-green-800"
          : "bg-yellow-100 text-yellow-800"
          }`}>
          {user.status === "active" && activeUsers.includes(user) ? "active" : "waitlist"}
        </span>
      ),
    }
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => (a.name || "").localeCompare(b.name || "") },
    { label: "Z to A", value: (a, b) => (b.name || "").localeCompare(a.name || "") },
    { label: "Newest First", value: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
    { label: "Oldest First", value: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
    { label: "Highest Earnings", value: (a, b) => (b.totalBalance || 0) - (a.totalBalance || 0) },
    { label: "Highest Withdrawals", value: (a, b) => (b.totalWithdraw || 0) - (a.totalWithdraw || 0) },
  ];

  const headerAction = (
    <div className="flex flex-col gap-4 w-full">
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
              Active Users Limit: {userLimit} ({currentActiveCount} active)
            </p>
            <p className="text-sm text-gray-500">
              Total users: {users.length}
            </p>
          </div>
          <button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditedLimit(userLimit);
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
        showAction={true}
        fetchData={fetchData}
      />
    </SidebarProvider>
  );
}