"use client";

import Navbar2 from "@/components/Navbar2";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const campaignsData = [
  {
    id: "nike",
    title: "Nike Campaign",
    category: "📺 Entertainment & Technology",
    views: 89000,
    date: "2025-06-23",
    amount: 678.5,
    status: "Pending",
  },
  {
    id: "adidas",
    title: "Adidas Campaign",
    category: "🍹 Food & Drink",
    views: 90000,
    date: "2025-06-24",
    amount: 699.99,
    status: "Active",
  },
  {
    id: "puma",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance",
    title: "New Balance ad",
    category: "🍹 Food & Drink",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
  {
    id: "newBalance2",
    title: "New Balance ad",
    category: "🥎 Sports & Fitness",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Pending",
  },
  {
    id: "puma2",
    title: "Puma Promotion",
    category: "🛍 Shopping",
    views: 91000,
    date: "2025-06-25",
    amount: 720.0,
    status: "Completed",
  },
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    const foundCampaign = campaignsData.find((c) => c.id === id);
    setCampaign(foundCampaign);
  }, [id]);

  if (!campaign)
    return (
      <div className="p-10 text-center text-gray-500">Campaign not found</div>
    );

  return (
    <main className="flex min-h-screen w-full flex-col bg-gray-100">
      <Navbar2 />

      <div className="p-6 space-y-6">
        {/* Header Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href="/CampaignDashboard"
            className="py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
          >
            ← Back
          </Link>

          <button
            type="button"
            className="flex items-center gap-2 py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
          >
            Actions <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Overview */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Enlarged Image */}
            <div className="flex-shrink-0">
              <Image
                src="/campaign-overview.jpg"
                alt="Campaign Thumbnail"
                width={240}
                height={160}
                className="rounded-lg object-cover"
              />
            </div>

            {/* Text Section with More Room */}
            <div className="flex-1">
              <h2 className="text-3xl font-semibold mb-2">{campaign.title}</h2>
              <span className="inline-block text-xs text-white bg-blue-500 px-3 py-1 rounded-full mb-4">
                {campaign.status}
              </span>

              <div className="text-[16px] text-gray-700 space-y-2 leading-relaxed">
                <p>
                  <strong>UTM Link:</strong>{" "}
                  <a
                    href="https://www.example.com"
                    className="text-blue-600 underline break-words"
                  >
                    https://www.example.com?utm_source=...
                  </a>
                </p>
                <p>
                  <strong>Date:</strong> {campaign.date}
                </p>
                <p>
                  <strong>Views:</strong> {campaign.views.toLocaleString()}
                </p>
                <p>
                  <strong>Category:</strong> {campaign.category}
                </p>
                <p>
                  <strong>Target Audience Age:</strong> 18–35
                </p>
                <p>
                  <strong>Gender:</strong> Female Only
                </p>
                <p>
                  <strong>Locations:</strong> AL, GA, FL
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 mb-2">Allocated Budget</h3>
            <p className="text-2xl font-bold text-gray-800">$30,000</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 mb-2">Total Spent</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${campaign.amount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-gray-500 mb-2">Remaining Budget</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${(30000 - campaign.amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
