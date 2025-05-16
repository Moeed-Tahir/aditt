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
import { ListFilter, ChevronsUpDown, Plus, X, Coffee, ChevronLeftCircle } from "lucide-react";
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
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sliderValue, setSliderValue] = useState(5); // Default value is 5

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
      complete: "Provide feedback for this completed campaign",
      cancel: "Are you sure you want to cancel this campaign?",
    };

    const smallTexts = {
      pause: "Are you sure you want to pause this campaign?",
      complete: "Please share your experience with this campaign",
      cancel: "Are you sure you want to cancel this campaign?",
    };

    const labels = {
      pause: "Pause",
      complete: "Submit Feedback",
      cancel: "Yes, Cancel Campaign",
    };

    if (type === "complete") {
      setDialogConfig({
        title: titles[type],
        smallText: smallTexts[type],
        confirmLabel: labels[type],
        onConfirm: () => {
          setDialogOpen(false);
          setFeedbackDialogOpen(true); // Show feedback dialog after confirmation
        },
      });
      setDialogOpen(true);
    } else {
      setDialogConfig({
        title: titles[type],
        smallText: smallTexts[type],
        confirmLabel: labels[type],
        onConfirm: () => {
          setDialogOpen(false);
          // Handle other actions here
        },
      });
      setDialogOpen(true);
    }
  };

  const FeedbackDialog = ({
    open,
    onClose,
    feedback,
    setFeedback,
    onSubmit,
  }) => {
    return (
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${
          open ? "" : "hidden"
        }`}
      >
        <div className="bg-white w-full max-w-[679px] h-auto max-h-[90vh] md:h-[763px] border rounded-[20px] p-[18px] flex flex-col mx-4 overflow-y-auto">
          <div className="flex items-center p-[12px] justify-center">
            <Coffee className="w-[54px] h-[54px] text-blue-300 text-center flex items-center justify-center" />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-lg font-medium">Campaign Feedback</h3>
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            We'd love to hear about your campaign's performance. Your feedback
            helps us improve!
          </p>

          {/* Scrollable content section */}
          <div className="flex-1 overflow-auto space-y-4">
            <div className="relative">
              <p className="text-[14px] mb-2 font-md">
                How many Conversions did your campaign have?
              </p>
              <input
                type="text"
                name="campaignFeedback"
                placeholder="Enter details..."
                className="w-full h-full p-[16px] border border-gray-300 rounded-full"
              />
            </div>

            <div className="relative">
              <p className="text-[14px] mb-2 font-md">
                How do you define conversions in this campaign (e.g. purchases,
                installs, followers, etc.)
              </p>
              <input
                type="text"
                name="campaignFeedback"
                placeholder="Enter details..."
                className="w-full h-full p-[16px] border border-gray-300 rounded-full"
              />
            </div>

            <div className="relative">
              <p className="text-[14px] font-md mb-2">
                How satisfied are you with your campaign?{" "}
              </p>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(e.target.value)}
                  className="w-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {sliderValue}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom fixed textarea and button */}
          <div className="mt-4">
            <p className="text-[14px] font-md mb-2">Feedback</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-[20px] mb-4 resize-none"
              rows={4}
              placeholder="Enter details..."
            />

            <div className="flex justify-end">
              <button
                onClick={() => {
                  onSubmit(feedback);
                  onClose();
                }}
                className="w-full h-[52px] text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
        <Navbar userId={userId} />

        <div className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <p className="text-[30px] font-md">Campaigns</p>
            <Link href={`/${userId}/create-campaign`} className="w-full md:w-auto">
              <button
                type="button"
                className="flex items-center justify-center gap-[12px] px-[28px] py-[16px] rounded-[80px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer w-full md:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Create new campaign</span>
              </button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
            <div className="flex-1 p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                📊 CAMPAIGNS CREATED
              </h2>
              <p className="font-md text-[30px]">
                {transformedCampaigns?.length}
              </p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🚀 ACTIVE CAMPAIGNS
              </h2>
              <p className="font-md text-[30px]">
                {
                  transformedCampaigns?.filter((c) => c.status === "Active")
                    .length
                }
              </p>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="flex-1 bg-white rounded-xl p-6">
              <h2 className="text-[16px] text-gray-400 mb-2">
                🎉 TOTAL ATTENTIVE ENGAGEMENTS
              </h2>
              <p className="font-md text-[30px]">
                {transformedCampaigns
                  ?.reduce((sum, c) => sum + c.views, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 mb-4 border-none border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-[18px] font-md text-gray-400">
                ALL CAMPAIGNS
              </h2>
              <div className="flex flex-col sm:flex-row gap-2">
              {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
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
                      className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
                    >
                      <ListFilter className="w-4 h-4 " /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-[16px] w-full sm:w-[343px] h-[296] p-[20px] gap-[24px] mr-10 mt-10">
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
                            className="w-full sm:w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
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
                            className="w-full sm:w-[146px] h-[44px] rounded-full gap-[8px] text-xs"
                          />
                        </div>
                      </div>

                      {/* Status Filters */}
                      <div>
                        <label className="block text-[16px] gap-[16px] font-medium text-black mb-1">
                          Status
                        </label>
                        <div className="flex flex-wrap gap-[11px]">
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
                      <div className="flex flex-col sm:flex-row gap-[10px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="w-full sm:w-[154px] h-[48px] rounded-full border text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer"
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
                          className="w-full sm:w-[154px] h-[48px] rounded-full border text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
                    <TableHead className="text-gray-500">Title</TableHead>
                    <TableHead className="text-gray-500">Total Views</TableHead>
                    <TableHead className="text-gray-500">Date</TableHead>
                    <TableHead className="text-gray-500">Amount</TableHead>
                    <TableHead className="text-gray-500">Status</TableHead>
                    <TableHead className="text-gray-500">Action</TableHead>
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
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
              <p className="text-sm text-gray-500">
                Showing {filteredCampaigns.length} result
                {filteredCampaigns.length !== 1 && "s"}
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      className="bg-blue-500 rounded-full"
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
        onConfirm={() => {
          dialogConfig.onConfirm(); // Perform your confirm action
          setDialogOpen(false); // Close confirmation dialog
          setFeedbackDialogOpen(true); // Open feedback dialog
        }}
        onCancel={() => setDialogOpen(false)}
      />
      <FeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={(feedback) => {
          // Handle feedback submission here
          console.log("Feedback submitted:", feedback);
          // You might want to make an API call here
        }}
      />
    </>
  );
}