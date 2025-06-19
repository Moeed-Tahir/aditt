"use client";

import { useEffect, useState } from "react";
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
  const [activeLimit, setActiveLimit] = useState(1000);
  const [waitlistLimit, setWaitlistLimit] = useState(500);
  const [editedLimit, setEditedLimit] = useState(1000);
  const [editingTarget, setEditingTarget] = useState("active");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [consumerUsers, setConsumerUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsumers = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/routes/v1/authRoutes?action=getAllConsumerUser");
      setConsumerUsers(response?.data?.latestUsers || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching consumer users");
      console.error('Error fetching consumer users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  const handleSaveLimit = () => {
    if (editingTarget === "active") setActiveLimit(editedLimit);
    else setWaitlistLimit(editedLimit);
    setShowLimitModal(false);
  };

  const processUsers = () => {
    if (!consumerUsers.length) return { activeUsers: [], waitlistUsers: [] };

    const sortedUsers = [...consumerUsers].sort((a, b) =>
      new Date(b.otpExpires) - new Date(a.otpExpires)
    );

    // Active users are the first N users up to activeLimit
    const activeUsers = sortedUsers.slice(0, activeLimit);

    // Waitlist users are the next M users up to waitlistLimit
    const waitlistUsers = sortedUsers.slice(activeLimit, activeLimit + waitlistLimit);

    return { activeUsers, waitlistUsers };
  };

  const { activeUsers, waitlistUsers } = processUsers();

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
            <div className="text-xs text-gray-500">{user.gender || "Not specified"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "PHONE NUMBER",
      key: "phone",
      render: (user) => user.phone || "N/A"
    },
    {
      label: "DOB",
      key: "dateOfBirth",
      render: (user) => user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-GB") : "N/A",
    },
    {
      label: "TOTAL EARNINGS",
      key: "earnings",
      render: (user) => (
        <span className="font-medium">
          {typeof user.earnings === 'number' ? `$${user.earnings.toLocaleString()}` : "$0"}
        </span>
      ),
    },
    {
      label: "TOTAL WITHDRAW",
      key: "withdraw",
      render: (user) => (
        <span className="font-medium">
          {typeof user.withdraw === 'number' ? `$${user.withdraw.toLocaleString()}` : "$0"}
        </span>
      ),
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => (a.name || "").localeCompare(b.name || "") },
    { label: "Z to A", value: (a, b) => (b.name || "").localeCompare(a.name || "") },
    { label: "Newest First", value: (a, b) => new Date(b.otpExpires) - new Date(a.otpExpires) },
    { label: "Oldest First", value: (a, b) => new Date(a.otpExpires) - new Date(b.otpExpires) },
  ];

  const dataToShow = activeTab === "active" ? activeUsers : waitlistUsers;

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
          Active Users ({activeUsers.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-full ${activeTab === "waitlist"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center`}
          onClick={() => setActiveTab("waitlist")}
        >
          Waitlist ({waitlistUsers.length})
        </button>
      </div>

      {/* Active tab info */}
      <div className="bg-white shadow-sm rounded-xl px-6 py-4 w-full flex justify-between items-start flex-wrap gap-4">
        <div>
          <p className="text-[22px] font-semibold text-gray-800">
            {activeTab === "active"
              ? `Active Users Limit: ${activeLimit} (${activeUsers.length} active)`
              : `Waitlist Limit: ${waitlistLimit} (${waitlistUsers.length} in waitlist)`}
          </p>
          <p className="text-sm text-gray-500">
            Total users: {consumerUsers.length}
          </p>
        </div>
        <button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingTarget(activeTab);
            setEditedLimit(activeTab === "active" ? activeLimit : waitlistLimit);
            setShowLimitModal(true);
          }}
          className="py-2 px-5 rounded-full bg-blue-600 text-white border border-blue-800 hover:bg-blue-800 transition flex items-center gap-2 justify-center"
        >
          Edit {activeTab === "active" ? "Active" : "Waitlist"} Limit
        </button>
      </div>

      {/* Limit edit modal */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingTarget === "active" ? "Active Users" : "Waitlist"} Limit
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
        filters={{ dateKey: "otpExpires" }} // Using otpExpires as the date filter key
        headerAction={headerAction}
        showHeaderAction={true}
        loading={loading}
      />
    </SidebarProvider>
  );
}