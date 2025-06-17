"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import { Button } from "@/components/ui/button";
import { Eye, Trash, EllipsisVertical } from "lucide-react";
import CampaignActionsDropdown from "../campaign/CampaignActionsDropdown";
import SortByAndFilters from "./SortByandFilters";

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
    <main className="flex h-auto min-h-screen w-full flex-col gap-0 bg-[var(--bg-color-off-white)]">
      <Navbar />
      <div className="p-4 sm:p-6">
        {showHeaderProfile && headerProfile && (
          <div className="max-w-[1440px] bg-white rounded-[15px] p-[0px] gap-[10px] mx-auto">
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

            <SortByAndFilters
              sortOptions={sortOptions}
              onSortChange={(fn) => {
                setSortBy(() => fn);
              }}
              onFilterChange={({ status, date }) => {
                setStatusFilter(status);
                setDateFilter(date);
              }}
            />
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
                        getActions(item)
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
