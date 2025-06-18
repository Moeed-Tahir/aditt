"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import RejectDialog from "@/components/RejectDialog";

export default function AccountDeleteRequests() {
  const [loading, setLoading] = useState("");
  const [deletionData, setDeletionData] = useState([]);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  console.log("deletionData", deletionData);

  const fetchDeletionRequest = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=getPendingDeletionRequests"
      );

      if (response.data.message === "Recieved Successfully Deletion Request") {
        setDeletionData(response.data.pendingRequests);
      }
    } catch (error) {
      console.error("Error fetching deletion requests:", error);
      toast.error("Failed to fetch deletion requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletionRequest();
  }, []);

  const handleApprove = async (userId) => {
    try {
      setLoading(`approving-${userId}`);
      const response = await axios.post(
        `/api/routes/v1/authRoutes?action=approveDeletionRequest`,
        { userId }
      );
      
      if (response.data.message === "Account deletion approved and user account removed") {
        toast.success("Account deletion approved");
        fetchDeletionRequest();
      }
    } catch (error) {
      console.error("Error approving deletion:", error);
      toast.error("Failed to approve deletion");
    } finally {
      setLoading("");
    }
  };

  const handleRejectClick = (userId) => {
    setSelectedUserId(userId);
    setIsRejectDialogOpen(true);
  };

  const handleReject = async ({ reason }) => {
    if (!selectedUserId) return;

    try {
      setLoading(`rejecting-${selectedUserId}`);
      const response = await axios.post(
        `/api/routes/v1/authRoutes?action=rejectDeletionRequest`,
        { reason, userId: selectedUserId }
      );
      
      if (response.data.message === "Account deletion request rejected") {
        toast.success("Deletion request rejected");
        fetchDeletionRequest();
      }
    } catch (error) {
      console.error("Error rejecting deletion:", error);
      toast.error("Failed to reject deletion");
    } finally {
      setLoading("");
      setIsRejectDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const columns = [
    {
      label: "ADVERTISERS",
      key: "name",
      render: (accountDelete) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{accountDelete.name}</div>
          </div>
        </div>
      ),
    },
    { label: "BUSINESS EMAIL", key: "businessEmail" },
    {
      label: "BUSINESS WEBSITE",
      key: "businessWebsite",
    }
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  const getAdsApprovalActions = (request) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleApprove(request._id)}
        disabled={loading === `approving-${request._id}`}
        className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
      >
        {loading === `approving-${request._id}` ? "Processing..." : "Accept"}
      </button>
      <button
        onClick={() => handleRejectClick(request._id)}
        disabled={loading === `rejecting-${request._id}`}
        className="text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
      >
        {loading === `rejecting-${request._id}` ? "Processing..." : "Reject"}
      </button>
      <button className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200">
        View
      </button>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="ACCOUNT DELETE REQUESTS"
        data={deletionData}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getAdsApprovalActions}
      />
      
      <RejectDialog
        open={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setSelectedUserId(null);
        }}
        onSave={handleReject}
      />
    </SidebarProvider>
  );
}