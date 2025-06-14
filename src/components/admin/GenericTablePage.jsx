"use client";
import { useState } from "react";
import Navbar from "../Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ListFilter,
  ChevronsUpDown,
  Eye,
  Trash,
  EllipsisVertical,
} from "lucide-react";
import CampaignActionsDropdown from "../campaign/CampaignActionsDropdown";

export function GenericTablePage({
  title = "Data Table",
  data = [],
  columns = [],
  sortOptions = [],
  getActions,
  renderActions,
  filters = {},
  showHeaderAction = false,
  headerAction = null,
  showHeaderProfile,
  headerProfile = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

  const itemsPerPage = 10;

  let filteredData = [...data];

  // Example filters
  if (statusFilter !== "All" && filters?.statusKey) {
    filteredData = filteredData.filter(
      (item) => item[filters.statusKey] === statusFilter
    );
  }

  if (dateFilter.from && filters?.dateKey) {
    filteredData = filteredData.filter(
      (item) => new Date(item[filters.dateKey]) >= new Date(dateFilter.from)
    );
  }
  if (dateFilter.to && filters?.dateKey) {
    filteredData = filteredData.filter(
      (item) => new Date(item[filters.dateKey]) <= new Date(dateFilter.to)
    );
  }

  if (sortBy && typeof sortBy === "function") {
    filteredData.sort(sortBy);
  }

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="py-4">
        {showHeaderProfile && headerProfile && (
          <div className="max-w-[1440px] bg-white rounded-[15px] p-[20px] gap-[10px] mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-blue-600 font-md text-lg md:text-[24px]">
                {headerProfile}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
            <p className="text-[30px] font-md">{showHeaderAction && title}</p>
            {showHeaderAction && headerAction}
          </div>
        </div>

        <div className="max-w-[1440px] bg-white rounded-[15px] p-[20px] gap-[10px] mx-auto">
          <div className="flex items-center mb-6 md:mb-10 justify-between flex-wrap gap-4">
            <div className="text-blue-600 font-md text-lg md:text-[24px]">
              {title}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              {sortOptions.length > 0 && (
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
                    {sortOptions.map(({ label, value }) => (
                      <DropdownMenuItem
                        key={label}
                        onSelect={() => setSortBy(value)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {filters?.statusKey && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-1 text-blue-600 rounded-full"
                    >
                      <ListFilter className="w-4 h-4" /> Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="rounded-[16px] w-[343px] p-[20px] gap-[24px]">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium">
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
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Status
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {["Active", "Pending", "Paused"].map((status) => (
                            <Button
                              key={status}
                              variant={
                                statusFilter === status ? "default" : "outline"
                              }
                              onClick={() =>
                                setStatusFilter(
                                  statusFilter === status ? "All" : status
                                )
                              }
                              className="rounded-full"
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-[8px]">
            <table className="min-w-full divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.label}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.map((item) => (
                  <tr key={item._id}>
                    {columns.map(({ key, render }) => (
                      <td
                        key={key}
                        className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                      >
                        {render ? render(item) : item[key]}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {getActions ? (
                        getActions(item) // NEW preferred method
                      ) : renderActions ? (
                        renderActions(item)
                      ) : (
                        <div className="flex gap-2">
                          <Trash className="w-4 h-4" />
                          <Eye className="w-4 h-4" />
                          <CampaignActionsDropdown
                            customTrigger={
                              <EllipsisVertical className="w-4 h-4" />
                            }
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-6">
            <p className="text-sm text-gray-500">
              Showing {filteredData.length} results
            </p>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={page === currentPage ? "default" : "outline"}
                    className={`rounded-full ${
                      page === currentPage ? "bg-blue-500 text-white" : ""
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
