"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

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
    views: 89000,
    date: "2025-06-23",
    amount: 678.5,
    status: "Pending",
  },
  {
    id: "adidas",
    title: "Adidas Campaign",
    category: "🍹 Food & Drink",
    views: 90000,
    date: "2025-06-24",
    amount: 699.99,
    status: "Active",
  },
  {
    id: "puma",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance",
    title: "New Balance ad",
    category: "🍹 Food & Drink",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance2",
    title: "New Balance ad",
    category: "🥎 Sports & Fitness",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Pending",
  },
  {
    id: "puma2",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91000,
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

  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />

        <div className="p-4">
          <div className="flex justify-between">
            <p className="text-3xl">Campaigns</p>
            <button
              type="submit"
              className="mt-4 py-4 px-6 rounded-[58px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Link href="/CampaignDashboard">+ Create new campaign</Link>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3  p-4">
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                📊 Campaigns Created
              </h2>
              <p>782</p>
            </div>
            <div className="bg-white border-1  rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                🚀 Active Campaigns
              </h2>
              <p>24</p>
            </div>
            <div className="bg-white border-1 rounded-xl p-6">
              <h2 className="text-l text-gray-400 font-light mb-2">
                🎉 Total Engagements
              </h2>
              <p>4.7M</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl text-gray-400">ALL CAMPAIGNS</h2>
              <div className="flex gap-2">
                {/* Filter Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Status: {statusFilter} <ChevronDown className="w-4 h-4" />
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

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      Sort: {sortBy || "None"}{" "}
                      <ChevronDown className="w-4 h-4" />
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
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[var(--bg-color-off-white)]">
                    <TableHead className=" text-gray-500 ">Title</TableHead>
                    <TableHead className=" text-gray-500 ">Category</TableHead>
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
                  {filteredCampaigns.map((c) => (
                    <TableRow
                      key={c.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <TableCell className="text-gray-800 py-6">
                        <Link
                          href={`/campaigns/${c.id}`}
                          className="text-gray-800 hover:underline"
                        >
                          {c.title}
                        </Link>
                      </TableCell>

                      <TableCell className="text-gray-800 py-6">
                        {c.category}
                      </TableCell>
                      <TableCell className="text-gray-800 py-6">
                        {c.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-800 py-6">
                        {new Date(c.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-800 py-6">
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <EllipsisVertical className="h-4 w-4 " />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link
                              href={`/EditCampaign/${c.id}`}
                              className="w-full"
                            >
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem
                              onClick={() => console.log("Pause", c.id)}
                            >
                              <Pause className="h-4 w-4" />
                              Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                console.log("Mark as Completed", c.id)
                              }
                            >
                              <CheckCheck className="h-4 w-4 text-green-600" />
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => console.log("Cancel", c.id)}
                            >
                              <X className="h-4 w-4 text-red-600" />
                              Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <Button variant="outline" size="sm">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
