"use client";
import Navbar from "@/components/Navbar";
import { CreateCampaigns } from "@/components/CreateCampaigns";

export default function CreateCampaign() {
  const userId = localStorage.getItem("userId") || "abcdef";

  return (
    <>
      <CreateCampaigns userId={userId} />
    </>
  );
}
