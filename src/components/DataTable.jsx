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
import { ListFilter, ChevronsUpDown, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";

export function DataTable({ campaignData }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("");
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const userId = Cookies.get("userId");

  // Transform the API data to match our table structure
  const transformedCampaigns = campaignData?.map((campaign) => ({
    id: campaign._id,
    title: campaign.campaignTitle,
    category: "No Category", // Default category since not in API
    views: campaign.totalViews || 0,
    date: campaign.campaignStartDate,
    amount: parseFloat(campaign.campaignBudget) || 0,
    status: campaign.status || "Pending",
  }));

  const filteredCampaigns = (transformedCampaigns || [])
    .filter((c) => {
      // Status filter
      const statusMatch = statusFilter === "All" || c.status === statusFilter;

      // Date filter
      let dateMatch = true;
      if (dateFilter.from || dateFilter.to) {
        const campaignDate = new Date(c.date);
        const fromDate = dateFilter.from ? new Date(dateFilter.from) : null;
        const toDate = dateFilter.to ? new Date(dateFilter.to) : null;

        if (fromDate && campaignDate < fromDate) dateMatch = false;
        if (toDate && campaignDate > toDate) dateMatch = false;
      }

      return statusMatch && dateMatch;
    })
    .sort((a, b) => {
      if (sortBy === "views_high_low") return b.views - a.views;
      if (sortBy === "views_low_high") return a.views - b.views;
      if (sortBy === "amount_high_low") return b.amount - a.amount;
      if (sortBy === "amount_low_high") return a.amount - b.amount;
      if (sortBy === "date_new_old")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date_old_new")
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "a_z") return a.title.localeCompare(b.title);
      if (sortBy === "z_a") return b.title.localeCompare(a.title);
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

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
    setShowFilters(false);
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setDateFilter({ from: "", to: "" });
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <div className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-[30px] font-md">Campaigns</p>
            <Link href={`/${userId}/create-campaign`}>
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
              <p>{transformedCampaigns?.length}</p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🚀 Active Campaigns
              </h2>
              <p>
                {
                  transformedCampaigns?.filter((c) => c.status === "Active")
                    .length
                }
              </p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🎉 Total Attentive Engagements
              </h2>
              <p>
                {transformedCampaigns
                  ?.reduce((sum, c) => sum + c.views, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-4 border-none border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-[18px] font-md text-gray-400">
                ALL CAMPAIGNS
              </h2>
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
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onSelect={() => setSortBy("a_z")}>
                      A to Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSortBy("z_a")}>
                      Z to A
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("views_high_low")}
                    >
                      Views (Highest to Lowest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("views_low_high")}
                    >
                      Views (Lowest to Highest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("amount_high_low")}
                    >
                      Amount (Highest to Lowest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("amount_low_high")}
                    >
                      Amount (Lowest to Highest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("date_new_old")}
                    >
                      Date (Newest to Oldest)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setSortBy("date_old_new")}
                    >
                      Date (Oldest to Newest)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1"
                    >
                      <ListFilter className="w-4 h-4 " /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-[16px] w-[343px] h-[296] p-[20px] gap-[24px] mr-10 mt-10">
                    <div className="space-y-3">
                      {/* Date Filters */}
                      <div>
                        <label className="block text-[16px] gap-[16px] font-medium text-black mb-1">
                          Date
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={dateFilter.from}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                from: e.target.value,
                              })
                            }
                            className="w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
                          />
                          <Input
                            type="date"
                            value={dateFilter.to}
                            onChange={(e) =>
                              setDateFilter({
                                ...dateFilter,
                                to: e.target.value,
                              })
                            }
                            className="w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
                          />
                        </div>
                      </div>

                      {/* Status Filters */}
                      <div>
                      <label className="block text-[16px] gap-[16px] font-medium text-black mb-1">
                      Status
                        </label>
                        <div className="flex w-[303px] h-[44px] flex-wrap gap-[11px]">
                          {["Active", "Pending", "Paused"].map((status) => (
                            <Button
                              key={status}
                              variant={
                                statusFilter === status ? "default" : "outline"
                              }
                              className="rounded-full text-[16px] font-md gap-[8px] p-[16px]"
                              onClick={() =>
                                setStatusFilter(
                                  statusFilter === status ? "All" : status
                                )
                              }
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-[317px] h-[48px] gap-[10px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="w-[154px] h-[48px] rounded-full border text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer"
                        >
                          Clear All
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            document.dispatchEvent(
                              new KeyboardEvent("keydown", { key: "Escape" })
                            )
                          }
                          className="w-[154px] h-[48px] rounded-full border text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
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
                          href={`campaigns?id=${c.id}`}
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
          <Charts />
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
