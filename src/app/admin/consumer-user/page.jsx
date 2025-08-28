"use client";

import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UsersPage() {
    const [userLimit, setUserLimit] = useState(0);
    const [editedLimit, setEditedLimit] = useState(0);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [approvingUserId, setApprovingUserId] = useState(null);
    const [rejectingUserId, setRejectingUserId] = useState(null);

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
            setApprovingUserId(userId);
            const response = await axios.post(
                "/api/routes/v1/authRoutes?action=verifiedConsumer",
                { userId }
            );
            toast.success("User verification approved successfully");
            fetchData();

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error approving verification"
            );
            console.error("Error approving verification:", error);
        } finally {
            setApprovingUserId(null);
        }
    };

    const handleReject = async (userId) => {
        try {
            setRejectingUserId(userId);

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
        } finally {
            setRejectingUserId(null);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            label: "USER",
            key: "user",
            render: (user) => (
                <div className="flex flex-col">
                    <div className="font-medium">{`${user.fullName}` || "No Name"}</div>
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
            label: "VERIFICATION Message",
            key: "identityVerificationMessage",
            render: (user) => {
                const message = user.identityVerificationMessage || "N/A";
                const truncatedMessage = message.length > 10
                    ? `${message.substring(0, 10)}...`
                    : message;

                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-sm font-mono text-gray-600 cursor-default">
                                    {truncatedMessage}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs break-words">{message}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            },
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
                        disabled={user.identityVerificationStatus === 'verified' || approvingUserId === user._id}
                        className="relative cursor-pointer"
                    >
                        {approvingUserId === user._id ? (
                            <>
                                <span className="opacity-0">Approve</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </>
                        ) : (
                            "Approve"
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(user._id)}
                        className="relative cursor-pointer"
                    >
                        {rejectingUserId === user._id ? (
                            <>
                                <span className="opacity-0">Reject</span>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            </>
                        ) : (
                            "Reject"
                        )}
                    </Button>
                </div>
            ),
        }

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