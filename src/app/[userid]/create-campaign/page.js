"use client";
import { CreateCampaigns } from "@/components/CreateCampaigns";
import Cookies from "js-cookie";

export default function CreateCampaign() {
  const userId = Cookies.get("userId");
  
  return (
    <>
      <CreateCampaigns userId={userId} />
    </>
  );
}
