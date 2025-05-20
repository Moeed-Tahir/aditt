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

const CampaignsTable = ({ paginatedCampaigns, campaignData, openDialog, handleAction, fetchCampaign }) => {
    const showActionColumn = paginatedCampaigns.some(c => c.status !== "Completed")

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[var(--bg-color-off-white)]">
                        <TableHead className="text-gray-500">Title</TableHead>
                        <TableHead className="text-gray-500">Total Views</TableHead>
                        <TableHead className="text-gray-500">Date</TableHead>
                        <TableHead className="text-gray-500">Amount</TableHead>
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
                                        className="text-gray-800 hover:underline"
                                    >
                                        {c.title}
                                    </Link>
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    {c.views.toLocaleString()} k
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    {new Date(c.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-gray-800 text-[14px] py-6">
                                    ${c.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                                        c.status === "Active" ? "bg-green-100 text-green-700" :
                                        c.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-blue-100 text-blue-700"
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