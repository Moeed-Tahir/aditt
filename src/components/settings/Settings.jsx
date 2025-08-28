"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import BusinessSettings from "@/components/settings/BusinessSettings";
import PersonalSettings from "@/components/settings/PersonalSettings";
import LogoutSection from "@/components/settings/LogoutSection";
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";

export default function Settings() {
  const [businessEditMode, setBusinessEditMode] = useState(false);
  const [personalEditMode, setPersonalEditMode] = useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    email: "",
    website: "",
    currentPassword: "",
    newPassword: "",
    companyName: "",
    brandName: "",
    phone: "",
    profileType: "",
  });
  const userId = Cookies.get("userId");
  
  const [error, setError] = useState("");
  
const fetchProfileData = async () => {
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=getProfile",
        { userId }
      );

      if (response.data.profile) {
        const profileData = response.data.profile;
        
        if (profileData.brandName) {
          Cookies.set("brandName", profileData.brandName, { 
            expires: 7,
          });
        }

        setFormData({
          userId: profileData.userId || "",
          name: profileData.name || "",
          email: profileData.businessEmail || "",
          website: profileData.businessWebsite || "",
          companyName: profileData.companyName || "",
          brandName: profileData.brandName || "",
          phone: profileData.phone || "",
          profileType: profileData.profileType || "",
          currentPassword: "",
          newPassword: "",
        });
      } else {
        setError(response.data.message || "Failed to get profile data");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile data");
    }
  };


  useEffect(() => {
    if (userId) fetchProfileData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUserData = async (isBusinessUpdate) => {
    if (isBusinessUpdate) setBusinessLoading(true);
    else setPersonalLoading(true);

    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        "/api/routes/v1/authRoutes?action=updateProfile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMessage({ text: "Profile updated successfully!", type: "success" });
        if (isBusinessUpdate) setBusinessEditMode(false);
        else setPersonalEditMode(false);
        fetchProfileData();
      }
    } catch (error) {
      console.error("Update failed:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      if (isBusinessUpdate) setBusinessLoading(false);
      else setPersonalLoading(false);
    }
  };

  const updatePassword = async () => {
    setPasswordLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        "/api/routes/v1/authRoutes?action=updatePassword",
        {
          userId: formData.userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      setMessage({
        text: error.response?.data?.message || "Failed to update password.",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Navbar userId={userId} />

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

        <BusinessSettings
          formData={formData}
          handleChange={handleChange}
          businessEditMode={businessEditMode}
          setBusinessEditMode={setBusinessEditMode}
          businessLoading={businessLoading}
          updateUserData={updateUserData}
        />

        <PersonalSettings
          formData={formData}
          handleChange={handleChange}
          personalEditMode={personalEditMode}
          setPersonalEditMode={setPersonalEditMode}
          personalLoading={personalLoading}
          passwordLoading={passwordLoading}
          updateUserData={updateUserData}
          updatePassword={updatePassword}
          showCurrentPassword={showCurrentPassword}
          setShowCurrentPassword={setShowCurrentPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
        />

        <LogoutSection />

        <DeleteAccountSection />
      </main>
    </>
  );
}
