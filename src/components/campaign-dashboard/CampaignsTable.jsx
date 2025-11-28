import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import CampaignActionsDropdown from '../campaign/CampaignActionsDropdown'
import Link from 'next/link'
import axios from 'axios'
import { toast } from "sonner";

const CampaignsTable = ({ paginatedCampaigns, campaignData, openDialog, handleAction, fetchCampaign }) => {
    const showActionColumn = paginatedCampaigns.some(c => c.status !== "Completed")

    const statusBadgeClasses = {
        Active: "bg-green-100 text-green-700",
        Pending: "bg-yellow-100 text-yellow-700",
        Paused: "bg-orange-100 text-orange-700",
        Completed: "bg-blue-100 text-blue-700",
        Rejected: "bg-red-100 text-red-700",
        Draft: "bg-gray-100 text-gray-700",
        Cancelled: "bg-purple-100 text-purple-700",
    }

    const handleDeleteCampaign = async (campaignId) => {
        try {
            const response = await axios.post('/api/routes/v1/campaignRoutes?action=deleteCampaignAgainstId', {
                campaignId: campaignId
            });

            if (response.status === 200) {
                toast.success('Campaign deleted successfully');
                fetchCampaign();
            } else {
                throw new Error(response.data.message || 'Failed to delete campaign');
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            toast.error(error?.response?.data?.message || "Error occurred while deleting campaign");
        }
    };


    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[var(--bg-color-off-white)]">
                        <TableHead className="text-gray-500">Title</TableHead>
                        <TableHead className="text-gray-500">Total Verified Responses</TableHead>
                        <TableHead className="text-gray-500">Date</TableHead>
                        <TableHead className="text-gray-500">Active Budget</TableHead>
                        <TableHead className="text-gray-500">Status</TableHead>
                        {showActionColumn && (
                            <TableHead className="text-gray-500">Action</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedCampaigns.map((c) => {
                        const specificCampaignData = campaignData.find(data => data._id === c.id)
                        return (
                            <TableRow key={c.id} className="hover:bg-gray-50 transition">
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    <Link
                                        href={`campaigns?id=${c.id}`}
                                        className="text-blue-600 hover:text-blue-800 underline font-bold"
                                    >
                                        {c.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    {c.engagements}
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    {new Date(c.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    ${c.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusBadgeClasses[c.status] || "bg-gray-100 text-gray-700"
                                        }`}>
                                        {c.status}
                                    </span>
                                </TableCell>
                                {showActionColumn && c.status !== "Completed" && (
                                    <TableCell>
                                        <CampaignActionsDropdown
                                            campaignId={c.id}
                                            campaignData={specificCampaignData}
                                            openDialog={openDialog}
                                            handleAction={handleAction}
                                            fetchCampaign={fetchCampaign}
                                            status={c.status}
                                            handleDeleteCampaign={handleDeleteCampaign}
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default CampaignsTable