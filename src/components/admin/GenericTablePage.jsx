"use client";

import { useState } from "react";
import Navbar from "../Navbar";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import Link from "next/link";
import SortByAndFilters from "@/components/admin/SortByAndFilters";
import ConfirmationModal from "../ConfirmationModal";
import axios from "axios";
import { toast } from "sonner";
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
  compactLayout = false,
  filterOptions = {
    date: true,
    status: true,
    customStatusOptions: [],
  },
  fetchData,
  fetchAdvertiserUser,
  showAction = true
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteClick = (item) => {
    console.log("item",item);

    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const deleteAccount = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=deleteConsumerUser",
        {
          id: itemToDelete._id,
        }
      );

      if (response.status === 200) {
        toast("Account deleted successfully");
        fetchData();
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const deleteAdvertiserAccount = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=deleteAdvertiserUser",
        {
          id: itemToDelete.id,
        }
      );

      if (response.status === 200) {
        toast("Account deleted successfully");
        fetchAdvertiserUser();
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      toast(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const defaultRenderActions = (item) => (
    <div className="flex gap-2">

      {title === "ADVERTISERS" && (
        <Link
          href={{
            pathname: "/admin/advertisers-profile",
            query: { id: item.userId },
          }}
          className="hover:underline"
        >
          <Eye className="w-4 h-4" />
        </Link>
      )}
      <button
        onClick={() => handleDeleteClick(item)}
        className="text-red-500 hover:text-red-700"
        aria-label="Delete"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <main
      className={`flex h-auto w-full flex-col ${compactLayout ? "" : "bg-[var(--bg-color-off-white)]"
        }`}
    >
      {" "}
      {!compactLayout && <Navbar mode="admin" />}
      <div className={`${compactLayout ? "" : "p-4 sm:p-6"}`}>
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
            <p className="text-[30px] font-md">{showHeaderAction}</p>
            {showHeaderAction && headerAction}
          </div>
        </div>
        <div className="max-w-[1440px] bg-white rounded-[15px] p-[20px] gap-[10px] mx-auto">
          <div className="flex items-center mb-6 md:mb-10 justify-between flex-wrap gap-4">
            <div className="text-blue-600 font-md text-lg md:text-[24px]">
              {title}
            </div>
            {!compactLayout && (
              <SortByAndFilters
                sortOptions={sortOptions}
                filterOptions={filterOptions}
                onSortChange={(fn) => {
                  setSortBy(() => fn);
                }}
                onFilterChange={({ status, date }) => {
                  setStatusFilter(status);
                  setDateFilter(date);
                  setCurrentPage(1); // Reset to first page when filters change
                }}
              />
            )}
            {compactLayout && (
              <Link
                href={{
                  pathname: "/admin/dashboard",
                }}
                className="text-blue-600 cursor-pointer"
              >
                See All
              </Link>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-[8px]">
            <table className="min-w-full divide-y divide-gray-200">
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
                  {showAction && (
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                      ACTIONS
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr key={item._id || item.id}>
                      {columns.map(({ key, render }) => (
                        <td
                          key={key}
                          className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {render ? render(item) : item[key]}
                        </td>
                      ))}
                      {
                        showAction && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {getActions
                              ? getActions(item)
                              : renderActions
                                ? renderActions(item)
                                : defaultRenderActions(item)}
                          </td>
                        )
                      }

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!compactLayout && filteredData.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-500">
                Showing {paginatedData.length} of {filteredData.length} results
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : ""
                      }
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={title === "USERS" ? deleteAccount : deleteAdvertiserAccount}
        title="Confirm Deletion"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmButtonText={isDeleting ? "Deleting..." : "Delete"}
        cancelButtonText="Cancel"
        isLoading={isDeleting}
        confirmButtonVariant="destructive"
      />
    </main>
  );
}