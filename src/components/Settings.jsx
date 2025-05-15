"use client";

import { allCountries } from "country-telephone-data";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  House,
  LandmarkIcon,
  Lock,
  Mail,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function Settings() {
  const [businessEditMode, setBusinessEditMode] = useState(false);
  const [personalEditMode, setPersonalEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    website: "",
    currentPassword: "",
    newPassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setFormData({
        userId: userData._id,
        name: userData.name || "",
        email: userData.email || "",
        website: userData.website || userData.businessWebsite || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/routes/v1/authRoutes?action=updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = {
          ...JSON.parse(localStorage.getItem("user")),
          ...formData,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setBusinessEditMode(false);
        setPersonalEditMode(false);
        if (formData.currentPassword && formData.newPassword) {
          await updatePassword();
        }
      }
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/routes/v1/authRoutes?action=updatePassword",
        {
          userId: formData.userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setMessage({ text: "Password updated successfully!", type: "success" });
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
      }
    } catch (error) {
      console.error("Password update failed:", error);
      setMessage({ text: "Failed to update password.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        "/api/routes/v1/authRoutes?action=deleteAccount",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { userId: formData.userId },
        }
      );

      if (response.status === 200) {
        localStorage.clear();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Account deletion failed:", error);
      setMessage({ text: "Failed to delete account.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Cookies.remove("userId");
    Cookies.remove("token");
    router.push("/signin-user");
  };

  return (
    <>
      <Navbar />

      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)] px-4 md:px-0">
        <h1 className="text-[24px] md:text-[30px] p-4 text-center font-md">
          Settings
        </h1>

        {message.text && (
          <div
            className={`w-full max-w-5xl mx-auto p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Business Information */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <label className="block text-[20px] md:text-[24px] font-medium">
                Business information
              </label>
              <span className="block text-[14px] md:text-[16px] text-gray-500 mt-1">
                Edit your business details to keep them up to date.
              </span>
            </div>
            <button
              className={`w-full md:w-[218px] h-[48px] md:h-[56px] text-[14px] md:text-[16px] rounded-full hover:bg-blue-700 ${
                businessEditMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:text-white"
              }`}
              onClick={() => {
                if (businessEditMode) updateUserData();
                setBusinessEditMode(!businessEditMode);
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : businessEditMode ? "Update" : "Edit"}
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Profile Type
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <LandmarkIcon className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <select
                  className="w-full appearance-none border border-gray-300 rounded-full pl-10 pr-10 py-2 text-gray-700"
                  disabled={!businessEditMode}
                >
                  <option value="">Select Profile</option>
                  <option value="agency">Marketing Agency</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Company Name
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Reebok promotion"
                  onChange={handleChange}
                  name="company"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  disabled={!businessEditMode}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Business Website (optional)
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  disabled={!businessEditMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <label className="block text-[20px] md:text-[24px] font-medium">
                Personal information
              </label>
              <span className="block text-[14px] md:text-[16px] text-gray-500 mt-1">
                Update your personal details to keep your profile accurate.
              </span>
            </div>
            <button
              className={`w-full md:w-[218px] h-[48px] md:h-[56px] text-[14px] md:text-[16px] rounded-full hover:bg-blue-700 ${
                personalEditMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:text-white"
              }`}
              onClick={() => {
                if (personalEditMode) updateUserData();
                setPersonalEditMode(!personalEditMode);
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : personalEditMode ? "Update" : "Edit"}
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Name
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  disabled={!personalEditMode}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium pt-0 md:pt-2">
                  Phone Number
                </label>
              </div>
              <div className="w-full md:flex-1">
                <div className="flex items-center border border-gray-300 rounded-full w-full overflow-visible">
                  <div className="relative flex-shrink-0">
                    <select
                      defaultValue="+1"
                      className="bg-transparent text-sm pl-4 pr-8 py-2 outline-none appearance-none"
                      disabled={!personalEditMode}
                    >
                      {allCountries.map((country) => {
                        const flag = country.iso2
                          .toUpperCase()
                          .replace(/./g, (char) =>
                            String.fromCodePoint(127397 + char.charCodeAt(0))
                          );
                        return (
                          <option key={country.iso2} value={country.dialCode}>
                            {flag} +{country.dialCode}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="h-6 w-px bg-gray-300 mx-2"></span>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="flex-1 pl-2 pr-4 py-2 text-sm bg-transparent outline-none"
                    disabled={!personalEditMode}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Email
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                  disabled
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  Current Password
                </label>
              </div>
              <div className="w-full md:flex-1">
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2"
                    disabled={!personalEditMode}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    disabled={!personalEditMode}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link
                    href="/reset-password"
                    className="text-blue-500 hover:underline font-medium text-sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-[16px] md:text-[18px] font-medium">
                  New Password
                </label>
              </div>
              <div className="relative w-full md:flex-1">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2"
                  disabled={!personalEditMode}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={!personalEditMode}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <label className="block text-[20px] md:text-[24px] font-medium">
                Logout
              </label>
              <span className="block text-[14px] md:text-[16px] text-gray-500 mt-1">
                Logout from your account
              </span>
            </div>
            <Link
              href="/signup-user"
              className="bg-white text-[14px] md:text-[16px] flex justify-center items-center font-md text-[#FF4319] w-full md:w-[230px] h-[48px] md:h-[56px] rounded-full border-2 border-[#FF4319] hover:bg-[#FF4319] hover:text-white"
              disabled={loading}
              onClick={handleLogout}
            >
              {loading ? "Processing..." : "Logout Account"}
            </Link>
          </div>
        </div>

        {/* Account Deletion Section */}
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 md:p-8 mb-5 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="w-full md:w-1/3">
              <label className="block text-[20px] md:text-[24px] font-medium">
                Account Deletion
              </label>
              <span className="block text-[14px] md:text-[16px] text-gray-500 mt-1">
                Easily delete your account and remove all associated data from
                our platform.
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-[14px] md:text-[16px] font-md text-[#FF4319] w-full md:w-[230px] h-[48px] md:h-[56px] rounded-full border-2 border-[#FF4319] hover:bg-[#FF4319] hover:text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : "Request Account Deletion"}
            </button>
          </div>
        </div>

        {/* Modal for Account Deletion */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white border text-center p-6 rounded-[20px] w-full max-w-[456px]">
              <Trash className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-[20px] md:text-[24px] font-md mb-4">
                Request account deletion
              </h3>
              <p className="text-[14px] md:text-[16px] text-gray-500 mb-6">
                We're sorry to see you go! Deleting your account will
                permanently remove all your data. Are you sure you want to
                proceed?
              </p>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="border w-full md:w-[204px] h-[44px] rounded-[58px] text-blue-600 bg-white hover:bg-blue-600 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAccount}
                  className="border w-full md:w-[204px] h-[44px] rounded-[58px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Proceed"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
