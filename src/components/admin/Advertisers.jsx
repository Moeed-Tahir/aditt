"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ListFilter,
  ChevronsUpDown,
  Eye,
  Trash,
  EllipsisVertical,
} from "lucide-react";

export function AdvertisersPage({ campaignData = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  const itemsPerPage = 10;

  const resetFilters = () => {
    setStatusFilter("All");
    setDateFilter({ from: "", to: "" });
    setSortBy(null);
  };

  let filteredUsers = [...campaignData];

  // Status Filter
  if (statusFilter !== "All") {
    filteredUsers = filteredUsers.filter(
      (user) => user.status === statusFilter
    );
  }

  // Date Filter (by DOB)
  if (dateFilter.from) {
    filteredUsers = filteredUsers.filter(
      (user) => new Date(user.dob) >= new Date(dateFilter.from)
    );
  }
  if (dateFilter.to) {
    filteredUsers = filteredUsers.filter(
      (user) => new Date(user.dob) <= new Date(dateFilter.to)
    );
  }

  // Sorting
  if (sortBy === "a_z") {
    filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "z_a") {
    filteredUsers.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === "views_high_low") {
    filteredUsers.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (sortBy === "views_low_high") {
    filteredUsers.sort((a, b) => (a.views || 0) - (b.views || 0));
  } else if (sortBy === "amount_high_low") {
    filteredUsers.sort((a, b) => b.totalEarning - a.totalEarning);
  } else if (sortBy === "amount_low_high") {
    filteredUsers.sort((a, b) => a.totalEarning - b.totalEarning);
  } else if (sortBy === "date_new_old") {
    filteredUsers.sort((a, b) => new Date(b.dob) - new Date(a.dob));
  } else if (sortBy === "date_old_new") {
    filteredUsers.sort((a, b) => new Date(a.dob) - new Date(b.dob));
  }

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="px-0 py-4 md:10">
        <div className="max-w-[1440px] bg-white rounded-[15px] p-[20px] gap-[10px] mx-auto">
          <div className="flex items-center mb-6 md:mb-10 justify-between flex-wrap gap-4">
            {/* Left side - Title */}
            <div className="text-blue-600 font-md text-lg md:text-[24px]">
            ADVERTISERS            </div>

            {/* Right side - Sort and Filter Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
                  >
                    Sort by
                    <ChevronsUpDown className="w-4 h-4" />
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
                  <DropdownMenuItem onSelect={() => setSortBy("date_new_old")}>
                    Date (Newest to Oldest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSortBy("date_old_new")}>
                    Date (Oldest to Newest)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
                  >
                    <ListFilter className="w-4 h-4" /> Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[16px] w-full sm:w-[343px] p-[20px] gap-[24px] mr-10 mt-10">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[16px] font-medium text-black mb-1">
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
                          className="w-full sm:w-[146px] h-[44px] rounded-full text-xs"
                        />
                        <Input
                          type="date"
                          value={dateFilter.to}
                          onChange={(e) =>
                            setDateFilter({ ...dateFilter, to: e.target.value })
                          }
                          className="w-full sm:w-[146px] h-[44px] rounded-full text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[16px] font-medium text-black mb-1">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-[11px]">
                        {["Active", "Pending", "Paused"].map((status) => (
                          <Button
                            key={status}
                            variant={
                              statusFilter === status ? "default" : "outline"
                            }
                            className="rounded-full text-[16px] font-md p-[16px]"
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

                    <div className="flex flex-col sm:flex-row gap-[10px]">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="w-full sm:w-[154px] h-[48px] rounded-full border text-blue-600 bg-white hover:bg-blue-600 hover:text-white"
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
                        className="w-full sm:w-[154px] h-[48px] rounded-full border text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* User Table */}
          <div className="mt-4 overflow-x-auto rounded-[8px] bg-white">
            <table className="min-w-full divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    ADVERTISERS
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    BUSINESS EMAIL
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    BUSINESS WEBSITE
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    NUM OF ADS
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    TOTAL SPENT
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                      {/* <img
                        src={`/${user.image || "default.jpg"}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      /> */}
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        {/* <span className="text-xs text-gray-500">
                          {user.gender || "Not specified"}
                        </span> */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.numOfAds}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${user.totalSpent}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Trash className="w-4 h-4" />
                        <Eye className="w-4 h-4" />
                        <EllipsisVertical className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-sm text-gray-500">
              Showing {filteredUsers.length} result
              {filteredUsers.length !== 1 && "s"}
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${
                      page === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-white text-blue-500"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
