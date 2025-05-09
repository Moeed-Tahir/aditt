"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  Globe,
  House,
  LandmarkIcon,
  Lock,
  Mail,
  User,
} from "lucide-react";

export function Settings() {
  const [businessEditMode, setBusinessEditMode] = useState(false);
  const [personalEditMode, setPersonalEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    website: "",
    currentPassword: "",
    newPassword: "",
  });

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
      }
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword) {
      setMessage({ text: "Please fill both password fields.", type: "error" });
      return;
    }

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

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar />

      <h1 className="text-2xl p-4 font-bold">Settings</h1>

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
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3">
            <label className="block text-lg font-medium">
              Business information
            </label>
            <span className="block text-xs text-gray-500 mt-1">
              Edit your business details to keep them up to date.
            </span>
          </div>
          <button
            className={`px-16 py-2 rounded-full hover:bg-blue-700 ${
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

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">Profile Type</label>
            </div>
            <div className="relative flex-1">
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

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">Company Name</label>
            </div>
            <div className="relative flex-1">
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

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">
                Business Website (optional)
              </label>
            </div>
            <div className="relative flex-1">
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
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3">
            <label className="block text-lg font-medium">
              Personal information
            </label>
            <span className="block text-xs text-gray-500 mt-1">
              Update your personal details to keep your profile accurate.
            </span>
          </div>
          <button
            className={`px-16 py-2 rounded-full hover:bg-blue-700 ${
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

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">Name</label>
            </div>
            <div className="relative flex-1">
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

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium pt-2">
                Phone Number
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded-full overflow-hidden w-full">
                <select
                  className="bg-transparent text-sm px-4 py-2 outline-none appearance-none"
                  disabled={!personalEditMode}
                >
                  <option value="+1">🇺🇸+1</option>
                  <option value="+44">🇬🇧+44</option>
                  <option value="+92">🇵🇰+92</option>
                  <option value="+971">🇦🇪+971</option>
                  <option value="+974">🇶🇦+974</option>
                </select>
                <span className="h-6 w-px bg-gray-300"></span>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full pl-2 pr-4 py-2 text-sm bg-transparent outline-none"
                  disabled={!personalEditMode}
                />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">Email</label>
            </div>
            <div className="relative flex-1">
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

          {/* Password fields – currently not hooked up */}
          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">
                Current Password
              </label>
            </div>
            <div className="relative flex-1">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter your current password"
                className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                disabled={!personalEditMode}
              />
            </div>
          </div>
          

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-sm font-medium">New Password</label>
            </div>
            <div className="relative flex-1">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                disabled={!personalEditMode}
              />
            </div>
          </div>
          {personalEditMode && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={updatePassword}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-yellow-600"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
        </div>
      </div>

     {/* Account Deletion Section */}
     <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3">
            <label className="block text-lg font-medium">
              Account Deletion
            </label>
            <span className="block text-xs text-gray-500 mt-1">
              Easily delete your account and remove all associated data from our
              platform.
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)} // Show the modal when clicked
            className="bg-white text-red-500 px-10 py-2 rounded-full border-2 border-red-500 hover:bg-red-700 hover:text-white"
            disabled={loading}
          >
            {loading ? "Processing..." : "Request Account Deletion"}
          </button>
        </div>
      </div>

      {/* Modal for Account Deletion */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl w-96">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)} // Close the modal
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount} // Proceed with account deletion
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
