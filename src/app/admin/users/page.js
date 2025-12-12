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
  DialogDescription,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("signupPipeline");
  const [userLimitEnabled, setUserLimitEnabled] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [tempLimitEnabled, setTempLimitEnabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const limitResponse = await axios.post("/api/routes/v1/adminDashboardRoutes?action=getUserLimit");
      setUserLimitEnabled(limitResponse.data.userLimit || false);
      setTempLimitEnabled(limitResponse.data.userLimit || false);

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

  const updateUserLimit = async (enabled) => {
    try {
      const limitResponse = await axios.post(
        "/api/routes/v1/adminDashboardRoutes?action=updateUserLimit",
        { userLimit: enabled }
      );

      setUserLimitEnabled(enabled);
      await fetchData(); // Refresh data
      
      toast.success(`User limit ${enabled ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update limit");
      console.error('Error updating limit:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveLimit = () => {
    updateUserLimit(tempLimitEnabled);
    setShowLimitModal(false);
  };

  const parseDateOfBirth = (dateString) => {
    if (!dateString) return null;

    if (typeof dateString === 'object') return dateString;

    if (typeof dateString === 'string' && dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }

    return new Date(dateString);
  };

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return "N/A";

    const date = parseDateOfBirth(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const activeUsers = users.filter(user =>
    user.status === "active" && user.identityVerificationStatus === "verified"
  );

  const waitlistUsers = users.filter(user =>
    user.status === "waitlist" &&
    (user.identityVerificationStatus === "false" || user.identityVerificationStatus === "verified")
  );

  const signupPipelineUsers = users.filter(user =>
    user.status === "signUpPipeline" &&
    (user.identityVerificationStatus === "approved" || user.identityVerificationStatus === "false" || user.identityVerificationStatus === "rejected" || user.identityVerificationStatus === "unKnown" || user.identityVerificationStatus === "in_progress")
  );

  const flaggedUsers = users.filter(user =>
    user.identityVerificationStatus === "pendingApproval"
  );

  const rejectedUsers = users.filter(user =>
    user.identityVerificationStatus === "denied"
  );

  const allUsers = users;

  const signupPipelineCount = signupPipelineUsers.length;
  const activeCount = activeUsers.length;
  const waitlistCount = waitlistUsers.length;
  const flaggedCount = flaggedUsers.length;
  const rejectedCount = rejectedUsers.length;
  const allUsersCount = allUsers.length;

  let dataToShow = [];
  switch (activeTab) {
    case "signupPipeline":
      dataToShow = signupPipelineUsers;
      break;
    case "active":
      dataToShow = activeUsers;
      break;
    case "waitlist":
      dataToShow = waitlistUsers;
      break;
    case "flagged":
      dataToShow = flaggedUsers;
      break;
    case "rejected":
      dataToShow = rejectedUsers;
      break;
    case "all":
      dataToShow = allUsers;
      break;
    default:
      dataToShow = signupPipelineUsers;
  }

  const columns = [
    {
      label: "USER",
      key: "email",
      render: (user) => (
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image
              width={32}
              height={32}
              src={user.image}
              alt={user.email || "No Email"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              {user.email ? user.email.charAt(0).toUpperCase() : "?"}
            </div>
          )}
          <div>
            <div>{user.email || "No Email"}</div>
          </div>
        </div>
      ),
    },
    {
      label: "DATE OF BIRTH",
      key: "dateOfBirth",
      render: (user) => formatDateOfBirth(user.dateOfBirth),
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
      label: "VERIFICATION STATUS",
      key: "identityVerificationStatus",
      render: (user) => {
        let statusClass = "";
        let displayStatus = "";

        if (user.identityVerificationStatus === "verified") {
          statusClass = "bg-green-100 text-green-800";
          displayStatus = "verified";
        } else if (user.identityVerificationStatus === "false") {
          statusClass = "bg-gray-100 text-gray-800";
          displayStatus = "false";
        } else if (user.identityVerificationStatus === "approved") {
          statusClass = "bg-gray-100 text-gray-800";
          displayStatus = "approved";
        } else if (user.identityVerificationStatus === "pendingApproval") {
          statusClass = "bg-yellow-100 text-yellow-800";
          displayStatus = "pending approval";
        } else if (user.identityVerificationStatus === "rejected") {
          statusClass = "bg-red-100 text-red-800";
          displayStatus = "rejected";
        }else if (user.identityVerificationStatus === "unKnown") {
          statusClass = "bg-red-100 text-red-800";
          displayStatus = "unKnown";
        } else {
          statusClass = "bg-gray-100 text-gray-800";
          displayStatus = "unknown status";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {displayStatus}
          </span>
        );
      },
    },
    {
      label: "ACCOUNT STATUS",
      key: "status",
      render: (user) => {
        let statusClass = "";
        let displayStatus = user.status;

        switch (user.status) {
          case "active":
            statusClass = "bg-green-100 text-green-800";
            break;
          case "waitlist":
            statusClass = "bg-yellow-100 text-yellow-800";
            break;
          case "flagged":
            statusClass = "bg-red-100 text-red-800";
            break;
          case "rejected":
            statusClass = "bg-gray-100 text-gray-800";
            break;
          case "pending":
          case "signUpPipeline":
          case "pending_verification":
            statusClass = "bg-blue-100 text-blue-800";
            displayStatus = "signup pipeline";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-800";
        }

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {displayStatus}
          </span>
        );
      },
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
      <div className="flex gap-1 rounded p-1 text-sm font-semibold w-full overflow-x-auto">
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "signupPipeline"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("signupPipeline")}
        >
          Sign Up Pipeline ({signupPipelineCount})
        </button>
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "active"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("active")}
        >
          Active Users ({activeCount})
        </button>
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "waitlist"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("waitlist")}
        >
          Waitlist ({waitlistCount})
        </button>
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "flagged"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("flagged")}
        >
          Flagged Users ({flaggedCount})
        </button>
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "rejected"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected Users ({rejectedCount})
        </button>
        <button
          className={`flex-1 py-2 px-2 rounded-full whitespace-nowrap ${activeTab === "all"
            ? "bg-blue-600 text-white border border-blue-800 hover:bg-blue-800"
            : "bg-white text-gray-700 border hover:bg-blue-600 hover:text-white"
            } transition flex items-center justify-center text-xs sm:text-sm`}
          onClick={() => setActiveTab("all")}
        >
          All Users ({allUsersCount})
        </button>
      </div>

      {activeTab === "active" && (
        <div className="bg-white shadow-sm rounded-xl px-6 py-4 w-full flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-sm text-gray-500">
              User limit is <span className={`font-semibold ${userLimitEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                {userLimitEnabled ? 'enabled' : 'disabled'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTempLimitEnabled(userLimitEnabled);
                setShowLimitModal(true);
              }}
              className="py-2 px-5 rounded-full bg-blue-600 text-white border border-blue-800 hover:bg-blue-800 transition flex items-center gap-2 justify-center"
            >
              Configure Limit
            </button>
          </div>
        </div>
      )}

      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Configure User Limit</DialogTitle>
            <DialogDescription>
              Enable or disable the user limit for active users
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">User Limit Status</p>
                  <p className="text-sm text-gray-500">
                    {tempLimitEnabled 
                      ? "Active users will be limited" 
                      : "No limit on active users"}
                  </p>
                </div>
                <button
                  onClick={() => setTempLimitEnabled(!tempLimitEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${tempLimitEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempLimitEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
              
              <div className={`p-3 rounded-lg ${tempLimitEnabled ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                <p className="text-sm font-medium">
                  {tempLimitEnabled ? '✓ Limit Enabled' : '✗ Limit Disabled'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {tempLimitEnabled 
                    ? "When enabled, only a fixed number of users can be active at once. Others will be moved to waitlist."
                    : "When disabled, all verified users can be active simultaneously."}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between gap-2 w-full">
              <button
                className="py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-gray-100 transition flex items-center gap-2 w-1/2 justify-center"
                onClick={() => setShowLimitModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLimit}
                className="py-2 px-5 rounded-full bg-blue-600 text-white border border-blue-800 hover:bg-blue-800 transition flex items-center gap-2 w-1/2 justify-center"
              >
                Save Changes
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
        activeTab={activeTab}
      />
    </SidebarProvider>
  );
}