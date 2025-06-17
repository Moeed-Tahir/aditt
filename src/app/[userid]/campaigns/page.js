"use client"

import CampaignDetailPage from '@/components/campaign/CampaignDetailPage'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from "next/navigation";
import axios from 'axios';
import { toast } from 'sonner';

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [campaignData, setCampaignData] = useState([]);
  
  console.log("campaignData", campaignData);

  const fetchCampaign = async () => {
    try {
      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getCampaignAgainstId", {
        id: id
      });

      if(response.data.message === "Campaign Retrieved Successfully"){
      setCampaignData(response.data.campaign);
      }       
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error is occur");

      console.error('Error creating campaign:', error);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  return (
    <>
      <CampaignDetailPage campaignId={id} campaignData={campaignData} />
    </>
  )
}

export default Page