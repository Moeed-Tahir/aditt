"use client";

import Navbar2 from "@/components/Navbar2";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import InternalHeader from "../InternalHeader";

function ChatSupport() {
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
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 userId={userId} />
      <div className="p-4 md:p-10">
        <InternalHeader
          backLink={userId ? `/${userId}/support` : "/"}
          heading="Contact support"
        />
        <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[24px] md:p-[40px] p-4 relative">
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between md:mb-8 gap-4 md:gap-0">
              <div className="w-full md:w-1/3">
                <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
                  Do you have any questions?
                </p>
                <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
                  Contrary to popular belief is not simply.
                </p>
              </div>

              <div className="w-full items-center md:justify-end justify-start hidden md:flex">
                <button
                  type="submit"
                  className="bg-blue-600 text-white md:text-[16px] md:leading-6 text-[14px] leading-4 px-8 py-4 rounded-[80px] hover:bg-blue-700 w-[218px] cursor-pointer"
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-200 hidden md:block" />

            {(error || success) && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  error
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {error || success}
              </div>
            )}

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col md:flex-row items-start gap-1 md:gap-6">
                <div className="w-full md:w-1/3">
                  <label
                    htmlFor="queryTitle"
                    className="block md:text-[18px] text-[14px] leading-[28px] font-medium text-gray-700"
                  >
                    Your query title
                  </label>
                </div>
                <div className="relative w-full md:flex-1">
                  <input
                    type="text"
                    id="queryTitle"
                    name="queryTitle"
                    placeholder="Enter your query title"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-gray-400"
                    value={queryTitle}
                    onChange={(e) => setQueryTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-start gap-1 md:gap-6">
                <div className="w-full md:w-1/3">
                  <label
                    htmlFor="queryDetail"
                    className="block md:text-[18px] text-[14px] leading-[28px] font-medium text-gray-700"
                  >
                    Query Details
                  </label>
                </div>
                <div className="relative w-full md:flex-1">
                  <textarea
                    placeholder="Enter a description"
                    rows={4}
                    id="queryDetail"
                    name="queryDetail"
                    className="w-full border border-gray-300 rounded-[20px] px-4 py-2 placeholder:text-[16px] placeholder:leading-[24px] placeholder:text-gray-400 resize-none"
                    value={queryDetail}
                    onChange={(e) => setQueryDetail(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="w-full items-center md:justify-end justify-start md:hidden flex">
              <button
                type="submit"
                className="bg-blue-600 text-white md:text-[16px] md:leading-6 text-[14px] leading-4 px-8 py-4 rounded-[80px] hover:bg-blue-700 w-[118px] cursor-pointer"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ChatSupport;
