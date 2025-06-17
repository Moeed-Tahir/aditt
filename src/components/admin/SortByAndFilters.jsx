"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, ListFilter, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils"; // Optional: For conditionally applying classes

export default function SortByAndFilters({
  sortOptions = [],
  onSortChange,
  onFilterChange,
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [selectedSortLabel, setSelectedSortLabel] = useState(null);


  const handleStatusClick = (status) => {
    const newStatus = statusFilter === status ? "All" : status;
    setStatusFilter(newStatus);
    onFilterChange({ status: newStatus, date: dateFilter });
  };

  const handleDateChange = (field, value) => {
    const newDateFilter = { ...dateFilter, [field]: value };
    setDateFilter(newDateFilter);
    onFilterChange({ status: statusFilter, date: newDateFilter });
  };

  const clearAll = () => {
    const clearedDate = { from: "", to: "" };
    setStatusFilter("All");
    setDateFilter(clearedDate);
    onFilterChange({ status: "All", date: clearedDate });
  };

  const applyFilters = () => {
    onFilterChange({ status: statusFilter, date: dateFilter });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Sort Dropdown */}
      {sortOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex rounded-full hover:text-white hover:bg-blue-600 text-blue-600 font-md text-[16px] items-center gap-1 w-full sm:w-auto"
            >
              Sort by <ChevronsUpDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-2xl shadow-md p-2">
            {sortOptions.map(({ label, value }) => (
              <DropdownMenuItem
                key={label}
                onSelect={() => {
                  setSelectedSortLabel(label);
                  onSortChange(value);
                }}
                className="cursor-pointer text-[15px] py-2 px-3 rounded-xl hover:bg-blue-100 flex justify-between items-center"
              >
                {label}
                {selectedSortLabel === label && <Check className="w-4 h-4 text-green-500" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-1 text-blue-600 rounded-full"
          >
            <ListFilter className="w-4 h-4" /> Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent   className="rounded-2xl w-[343px] p-5 gap-6 space-y-6 shadow-md translate-x-[-40px]"
        >
          {/* Date Filter */}
          <div>
            <p className="text-sm font-semibold mb-2">Date</p>
            <div className="flex gap-2">
              {["from", "to"].map((field) => (
                <div
                  key={field}
                  className="relative flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2"
                >
                  <Input
                    type="date"
                    value={dateFilter[field]}
                    onChange={(e) => handleDateChange(field, e.target.value)}
                    className="appearance-none bg-transparent outline-none border-none p-0 w-full text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <p className="text-sm font-semibold mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {["Active", "Pending", "Paused"].map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  onClick={() => handleStatusClick(status)}
                  className={cn(
                    "rounded-full text-sm px-4 py-2",
                    statusFilter === status &&
                      "bg-blue-600 text-white hover:bg-blue-600"
                  )}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between pt-2 gap-3">
            <Button
              variant="outline"
              onClick={clearAll}
              className="rounded-full text-blue-600 border-blue-600 hover:bg-blue-50 w-1/2"
            >
              Clear all
            </Button>
            <Button
              onClick={applyFilters}
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white w-1/2"
            >
              Apply
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
