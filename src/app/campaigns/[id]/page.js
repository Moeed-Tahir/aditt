"use client";

import Navbar2 from "@/components/Navbar2";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import PieCharts from "@/components/PieCharts";
import BarCharts from "@/components/BarCharts";
import AreaCharts from "@/components/AreaCharts";
import ProgressBar from "@/components/ProgressBar";

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

          <div className=" text-center text-gray-800">Campaign Overview</div>

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
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    UTM Link:
                  </strong>
                  <a
                    href="https://www.example.com"
                    className="text-blue-600 underline break-words"
                  >
                    https://www.example.com?utm_source=...
                  </a>
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Date:
                  </strong>{" "}
                  {campaign.date}
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Views:
                  </strong>{" "}
                  {campaign.views.toLocaleString()}
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Category:
                  </strong>{" "}
                  {campaign.category}
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Target Audience Age:
                  </strong>{" "}
                  18–35
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Gender:
                  </strong>{" "}
                  Female Only
                </p>
                <p>
                  <strong className="text-[16px] text-gray-400 space-y-2 leading-relaxed">
                    Locations:
                  </strong>{" "}
                  AL, GA, FL
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Summary */}

        <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
          <div className="flex-1 p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Allocated Budget
            </h2>
            <p className="text-2xl font-bold text-gray-800">$30,000</p>
          </div>

          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          <div className="flex-1 bg-white rounded-xl p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Total Spent
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              {campaign.amount.toLocaleString()}
            </p>{" "}
          </div>

          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          <div className="flex-1 bg-white rounded-xl p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Remaining Budget
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              {(30000 - campaign.amount).toFixed(2)}
            </p>{" "}
          </div>
        </div>
        {/* Quiz and Survey Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quiz Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quiz details
            </h2>

            {/* Quiz Info */}
            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                QUIZ INFO
              </h3>
              <div className="bg-[var(--bg-color-off-white)] p-10 rounded-xl">
                <p className="text-gray-700 text-sm">
                  What is the primary purpose of blockchain technology in
                  cryptocurrency?
                </p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  <li>
                    A. To store user data{" "}
                    <span className="float-right">24%</span>
                  </li>
                  <li>
                    B. To facilitate secure transactions{" "}
                    <span className="float-right">54%</span>
                  </li>
                  <li>
                    C. To create digital wallets{" "}
                    <span className="float-right">12%</span>
                  </li>
                  <li>
                    D. To regulate global currency{" "}
                    <span className="float-right">10%</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quiz Responses (Mock Donut Chart) */}
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-3">
                QUIZ RESPONSES
              </h3>
              <div className="bg-[var(--bg-color-off-white)] p-10 rounded-xl">
                <div>
                  <PieCharts />
                </div>
                <div className="flex flex-col items-center gap-6">
                  {/* Chart on Top */}

                  {/* Options Below */}
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 w-full max-w-md">
                    <div className="bg-white p-6 rounded-md">🟢 Option A: 32.8k (24%)</div>
                    <div className="bg-white p-6 rounded-md">🔵 Option B: 45.9k (54%)</div>
                    <div className="bg-white p-6 rounded-md">🟠 Option C: 15.5k (12%)</div>
                    <div className="bg-white p-6 rounded-md">🔴 Option D: 13.7k (10%)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Survey Details */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Survey details
            </h2>

            {/* Survey Question 1 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>SURVEY QUESTION 1</span>
                <span className="font-bold text-xl text-gray-700">
                  25,400 Responses
                </span>
              </div>
              <div className="p-5 bg-[var(--bg-color-off-white)]">
                <div className="p-5 relative">
                  <ProgressBar value={25} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {25}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={60} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {60}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={45} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {45}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={30} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black">
                    {30}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={30} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {30}%
                  </span>
                </div>
              </div>
            </div>

            {/* Survey Question 2 */}
            <div>
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>SURVEY QUESTION 2</span>
                <span className="font-bold text-xl text-gray-700">
                  23,240 Responses
                </span>
              </div>
              <div className="p-5 bg-[var(--bg-color-off-white)]">
                <div className="p-5 relative">
                  <ProgressBar value={25} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {25}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={60} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {60}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={45} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {45}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={30} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black">
                    {30}%
                  </span>
                </div>
                <div className="p-5 relative">
                  <ProgressBar value={30} fill="bg-white" />
                  <span className="absolute inset-0 flex items-center justify-center text-black ">
                    {30}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row p-4 mt-4 mb-4 bg-white rounded-xl">
          <div className="flex-1 p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Impressions
            </h2>
            <p className="text-2xl font-bold text-gray-800">1,250,000</p>
          </div>

          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          <div className="flex-1 bg-white rounded-xl p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Completed Engagements
            </h2>
            <p className="text-2xl font-bold text-gray-800">75,000</p>
          </div>

          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          <div className="flex-1 bg-white rounded-xl p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">Ad Clicks</h2>
            <p className="text-2xl font-bold text-gray-800">30,000</p>
          </div>
          <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

          <div className="flex-1 bg-white rounded-xl p-6">
            <h2 className="text-l text-gray-400 font-light mb-2">
              Click-through rate
            </h2>
            <p className="text-2xl font-bold text-gray-800">40%</p>
          </div>
        </div>

        <div>
          <div className="flex justify-center">
            <div className="w-300">
              <AreaCharts />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-1  md:col-span-2 bg-white p-6 rounded-xl border">
            <BarCharts />
          </div>
          <div className="col-span-1  bg-white p-6 rounded-xl border">
            <h3 className="text-gray-600 text-xl font-medium mb-3">
              Gender breakdown
            </h3>
            <h3 className="text-gray-500 text-sm font-medium mb-3">
              Percentage of users based on gender
            </h3>
            <PieCharts />
            <div className="grid grid-cols-3 text-sm text-gray-600 w-full max-w-md">
              <div>🟢 Male</div>
              <div>🔵 Female</div>
              <div>🟠 Prefer Not to Say</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
