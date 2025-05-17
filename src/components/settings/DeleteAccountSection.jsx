"use client";
import ConfirmationModal from "@/components/ConfirmationModal";
import Cookies from "js-cookie";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const deleteAccount = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = Cookies.get("token");
      const userId = Cookies.get("userId");

      if (!userId) {
        throw new Error("User session expired. Please login again.");
      }

      const response = await axios.delete(
        "/api/routes/v1/authRoutes?action=deleteAccount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { userId },
        }
      );

      if (response.status === 200) {
        // Clear all relevant cookies
        Cookies.remove("userId");
        Cookies.remove("token");
        // Cookies.remove("user");

        // Redirect to login page
        router.push("/signin-user");
      }
    } catch (error) {
      console.error("Account deletion failed:", error);

      // Handle different error scenarios
      if (error.response) {
        switch (error.response.data.code) {
          case "INVALID_USER_ID":
            setError("Invalid user account. Please login again.");
            break;
          case "USER_NOT_FOUND":
            setError("User account not found.");
            break;
          default:
            setError(
              error.response.data.message || "Failed to delete account."
            );
        }
      } else {
        setError(error.message || "Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8 mb-5 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="w-full">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Account Deletion
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            This will permanently delete your account and all associated data.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-[14px] md:text-[16px] font-md text-[#FF4319] md:w-[300px] h-[48px] md:h-[56px] rounded-full border-2 border-[#FF4319] hover:bg-[#FF4319] hover:text-white cursor-pointer w-max"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Request account deletion"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteAccount}
        title="Confirm Account Deletion"
        description="We're sorry to see you go! Deleting your account will permanently remove all your data. Are you sure you want to proceed?"
        confirmButtonText={isLoading ? "Deleting..." : "Delete Account"}
        cancelButtonText="Cancel"
        isLoading={isLoading}
        confirmButtonVariant="destructive"
      />
    </div>
  );
}
