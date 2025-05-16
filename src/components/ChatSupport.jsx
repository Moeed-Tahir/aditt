"use client";

import Navbar2 from "@/components/Navbar2";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

export function ChatSupport() {
  const userId = Cookies.get("userId");
  const [queryTitle, setQueryTitle] = useState("");
  const [queryDetail, setQueryDetail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!queryTitle || !queryDetail) {
      setError("Both query title and details are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/routes/v1/userChatSupportRoutes?action=addChatSupport",
        {
          userId,
          queryTitle,
          queryDetail,
        }
      );

      if (response.data.success) {
        setSuccess("Your query has been submitted successfully!");
        setQueryTitle("");
        setQueryDetail("");
      } else {
        setError(response.data.message || "Failed to submit query");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "An error occurred while submitting your query"
        );
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar2 userId={userId} />
        <div className="p-4 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative flex items-center mb-6 md:mb-10 justify-between">
              <Link
                href="/support"
                className="py-2 px-4 md:px-5 md:ml-5 rounded-full bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Back</span>
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 font-md text-sm md:text-[24px]">
                Contact Support
              </div>
              <div className="w-[60px] md:w-[90px]" />
            </div>
          </div>
          
          <div className="w-full max-w-[1200px] mx-auto bg-white rounded-2xl shadow p-4 md:p-8 relative">
            <form onSubmit={onSubmit}>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
                <div className="w-full md:w-1/3">
                  <label className="block text-base md:text-lg font-medium">
                    Do you have any questions?
                  </label>
                  <span className="block text-xs text-gray-500 mt-1">
                    Contrary to popular belief is not simply.
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 md:px-[28px] w-full md:w-[218px] h-[48px] md:h-[56px] py-2 md:py-[16px] rounded-full hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              {(error || success) && (
                <div
                  className={`mb-4 p-3 rounded-md ${
                    error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {error || success}
                </div>
              )}

              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium">
                      Your query title
                    </label>
                  </div>
                  <div className="relative w-full md:flex-1">
                    <input
                      type="text"
                      placeholder="Enter your query title"
                      className="w-full border border-gray-300 rounded-full pl-3 pr-4 py-2"
                      value={queryTitle}
                      onChange={(e) => setQueryTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                  <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium">
                      Query Details
                    </label>
                  </div>
                  <div className="relative w-full md:flex-1">
                    <textarea
                      placeholder="Enter a description"
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none"
                      value={queryDetail}
                      onChange={(e) => setQueryDetail(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}