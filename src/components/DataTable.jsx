"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import CampaignActionsDropdown from "@/components/CampaignActionsDropdown";
import Charts from "@/components/Charts";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ellipsis,
  EllipsisVertical,
  Pencil,
  Pause,
  CheckCheck,
  X,
  ChevronUp,
  ListFilter,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const campaignsData = [
  {
    id: "nike",
    title: "Nike Campaign",
    category: "📺 Entertainment & Technology",
    views: 89,
    date: "2025-06-23",
    amount: 678.5,
    status: "Pending",
  },
  {
    id: "adidas",
    title: "Adidas Campaign",
    category: "🍹 Food & Drink",
    views: 9,
    date: "2025-06-24",
    amount: 699.99,
    status: "Active",
  },
  {
    id: "puma",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance",
    title: "New Balance ad",
    category: "🍹 Food & Drink",
    views: 91,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance2",
    title: "New Balance ad",
    category: "🥎 Sports & Fitness",
    views: 91,
    date: "2025-06-25",
    amount: 720.0,
    status: "Pending",
  },
  {
    id: "puma2",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
];

export function DataTable() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");

  const filteredCampaigns = campaignsData
    .filter((c) => statusFilter === "All" || c.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === "views") return b.views - a.views;
      if (sortBy === "amount") return b.amount - a.amount;
      if (sortBy === "date")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      return 0;
    });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    smallText: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const openDialog = (title, smallText, confirmLabel, onConfirm) => {
    setDialogConfig({ title, smallText, confirmLabel, onConfirm });
    setDialogOpen(true);
  };

  const handleAction = (type, campaignId) => {
    const titles = {
      pause: "Are you sure you want to pause this campaign?",
      complete: "Are you sure you want to mark this campaign as completed?",
      cancel: "Are you sure you want to cancel this campaign?",
    };

    const smallTexts = {
      pause: "Are you sure you want to pause this campaign?",
      complete: "Are you sure you want to mark this campaign as completed?",
      cancel: "Are you sure you want to cancel this campaign?",
    };

    const labels = {
      pause: "Pause",
      complete: "Complete",
      cancel: "Yes, Cancel Campaign",
    };

    setDialogConfig({
      title: titles[type],
      smallText: smallTexts[type],
      confirmLabel: labels[type],
      onConfirm: () => {
        console.log(`${type} campaign:`, campaignId);
        setDialogOpen(false);
      },
    });

    setDialogOpen(true);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-3xl">Campaigns</p>
            <Link href="/create-campaign/id">
              <button
                type="button"
                className="flex items-center justify-center w-[241px] h-[56px] rounded-[80px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>Create new campaign</span>
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
            <div className="flex-1 p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                📊 Campaigns Created
              </h2>
              <p className="font-md text-[30px]">782</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🚀 Active Campaigns
              </h2>
              <p className="font-md text-[30px]">24</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🎉 Total Attentive Engagements
              </h2>
              <p className="font-md text-[30px]">4.7M</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-[18px] font-md text-gray-400">ALL CAMPAIGNS</h2>
              <div className="flex gap-2">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1"
                    >
                      Sort by
                      <div>
                        <ChevronsUpDown className="w-4 h-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["views", "amount", "date"].map((field) => (
                      <DropdownMenuItem
                        key={field}
                        onSelect={() => setSortBy(field)}
                      >
                        {field[0].toUpperCase() + field.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1"
                    >
                      <ListFilter className="w-4 h-4" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["All", "Active", "Pending", "Completed"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onSelect={() => setStatusFilter(status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--bg-color-off-white)]">
                    <TableHead className=" text-gray-500 ">Title</TableHead>
                    <TableHead className=" text-gray-500 ">
                      Total Views
                    </TableHead>
                    <TableHead className=" text-gray-500 ">Date</TableHead>
                    <TableHead className=" text-gray-500 ">Amount</TableHead>
                    <TableHead className=" text-gray-500 ">Status</TableHead>
                    <TableHead className=" text-gray-500 ">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCampaigns.map((c) => (
                    <TableRow
                      key={c.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="text-gray-800 text-[14px] py-6">
                        <Link
                          href={`/campaigns/${c.id}`}
                          className="text-gray-800 hover:underline"
                        >
                          {c.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-80 text-[14px] py-6">
                        {c.views.toLocaleString()} k
                      </TableCell>
                      <TableCell className="text-gray-800 text-[14px] py-6">
                        {new Date(c.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-800 text-[14px] py-6">
                        ${c.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            c.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : c.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <CampaignActionsDropdown
                          campaignId={c.id}
                          openDialog={openDialog}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing {filteredCampaigns.length} result
                {filteredCampaigns.length !== 1 && "s"}
              </p>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
          <Charts/>
        </div>
        
      </main>
      <ConfirmationDialogue
        open={dialogOpen}
        title={dialogConfig.title}
        smallText={dialogConfig.smallText}
        confirmLabel={dialogConfig.confirmLabel}
        onConfirm={dialogConfig.onConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}
