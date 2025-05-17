"use client"

import CampaignDetailPage from '@/components/CampaignDetailPage'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from "next/navigation";
import axios from 'axios';

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [campaignData, setCampaignData] = useState([]);

  const fetchCampaign = async () => {
    try {

      const response = await axios.post("/api/routes/v1/campaignRoutes?action=getCampaignAgainstId", {
        id: id
      });

      setCampaignData(response.data.campaign);
      console.log("Campaign data:", response.data.campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  return (
    <>
      <CampaignDetailPage campaignData={campaignData} />
    </>
  )
}

export default Page