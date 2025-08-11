"use client";

import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState("active");
    const [userLimit, setUserLimit] = useState(0);
    const [editedLimit, setEditedLimit] = useState(0);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const limitResponse = await axios.post(
                "/api/routes/v1/adminDashboardRoutes?action=getUserLimit"
            );
            setUserLimit(limitResponse.data.userLimit || 0);
            setEditedLimit(limitResponse.data.userLimit || 0);

            const usersResponse = await axios.post(
                "/api/routes/v1/authRoutes?action=getUnverifiedConsumerUser"
            );
            setUsers(usersResponse.data.unverifiedUsers || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error fetching data");
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleApprove = async (userId) => {
        try {
            const response = await axios.post(
                "/api/routes/v1/authRoutes?action=verifiedConsumer",
                { userId }
            );
            toast.success("User verification approved successfully");
            if (response.data) {
                fetchData();
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error approving verification"
            );
            console.error("Error approving verification:", error);
        }
    };

    const handleReject = async (userId) => {
        try {
            const response = await axios.post(
                "/api/routes/v1/authRoutes?action=rejectedConsumer",
                {
                    userId
                }
            );
            toast.success("User verification rejected successfully");
            setRejectionReason("");
            setSelectedUserId(null);
            fetchData();
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error rejecting verification"
            );
            console.error("Error rejecting verification:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns = [
        {
            label: "USER",
            key: "user",
            render: (user) => (
                <div className="flex flex-col">
                    <div className="font-medium">{`${user.firstName || ''} ${user.lastName || ''}`.trim() || "No Name"}</div>
                    <div className="text-sm text-gray-500">{user.email || "No email"}</div>
                </div>
            ),
        },
        {
            label: "DATE OF BIRTH",
            key: "dateOfBirth",
            render: (user) => user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "N/A",
        },
        {
            label: "VERIFICATION SESSION ID",
            key: "verificationSessionId",
            render: (user) => (
                <div className="text-sm font-mono text-gray-600">
                    {user.verificationSessionId || "N/A"}
                </div>
            ),
        },
        {
            label: "ACTIONS",
            key: "actions",
            render: (user) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleApprove(user._id)}
                        disabled={user.identityVerificationStatus === 'verified'}
                    >
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(user._id)}
                        disabled={user.identityVerificationStatus === 'rejected'}
                    >
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const sortOptions = [
        { label: "A to Z", value: (a, b) => (a.firstName || "").localeCompare(b.firstName || "") },
        { label: "Z to A", value: (a, b) => (b.firstName || "").localeCompare(a.firstName || "") },
        { label: "Newest First", value: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
        { label: "Oldest First", value: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
    ];

    const filterOptions = {
        date: true,
        status: false,
    };

    return (
        <SidebarProvider>
            <AppSidebar mode="admin" />
            <GenericTablePage
                title="Pending Users"
                data={users}
                columns={columns}
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                filters={{ dateKey: "createdAt" }}
                showHeaderAction={true}
                loading={loading}
                showAction={false}
            />
        </SidebarProvider>
    );
}