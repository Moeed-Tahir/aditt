"use client";

import Navbar2 from "@/components/Navbar2";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, CircleAlert, Copy } from "lucide-react";
import Image from "next/image";
import PieCharts from "@/components/PieCharts";
import BarCharts from "@/components/BarCharts";
import AreaCharts from "@/components/AreaCharts";
import ProgressBar from "@/components/ProgressBar";
import CampaignActionsDropdown from "@/components/CampaignActionsDropdown";
import ConfirmationDialogue from "@/components/ConfirmationDialogue";
import QuizResponseChart from "@/components/QuizResponseChart";

const campaignsData = [
  {
    id: "nike",
    title: "Nike Campaign",
    category: "📺 Entertainment & Technology",
    views: 89000,
    date: "2024-06-23",
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
    date: "2023-06-25",
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
  const [showExpiredAlert, setShowExpiredAlert] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    smallText: "",
    confirmLabel: "",
    onConfirm: () => {},
  });

  const openDialog = (title, smallText, confirmLabel, onConfirm) => {
    setDialogConfig({ title, smallText, confirmLabel, onConfirm });
    setDialogOpen(true);
  };

  useEffect(() => {
    const foundCampaign = campaignsData.find((c) => c.id === id);
    setCampaign(foundCampaign);
  }, [id]);

  if (!campaign)
    return (
      <div className="p-10 text-center text-gray-500">Campaign not found</div>
    );

  const isCampaignExpired = new Date(campaign.date) < new Date();

  const handleEndCampaign = () => {
    // Here you would typically update the campaign status in your database
    // For now, we'll just hide the alert
    setShowExpiredAlert(false);
  };

  const handleReactivateCampaign = () => {
    // Here you would typically update the campaign status in your database
    // For now, we'll just hide the alert
    setShowExpiredAlert(false);
  };

  return (
    <>
      <Navbar2 />

      <main className="flex min-h-screen w-full max-w-[1440px] mx-auto flex-col">
        <div className="p-6 space-y-6">
          {/* Header Buttons */}
          <div className="flex justify-between items-center">
            <Link
          href="/userid/campaign-dashboard"
          className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft />
              Back
            </Link>

            <div className=" text-center text-gray-800">Campaign Overview</div>

            <CampaignActionsDropdown
              campaignId={campaign.id}
              openDialog={openDialog}
              customTrigger={
                <button
                  type="button"
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition"
                >
                  Actions <ChevronDown className="w-4 h-4" />
                </button>
              }
            />
          </div>

          {/* Campaign Overview */}
          <div className="bg-white p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <Image
                  src="/campaign-overview.jpg"
                  alt="Campaign Thumbnail"
                  width={200}
                  height={160}
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Title + Status */}
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {campaign.title}
                  </h2>
                  <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Pending
                  </span>
                </div>

                {/* UTM Link full width with copy button */}
                <div>
                  <div className="flex items-center rounded-lg overflow-hidden">
                    <div className="text-sm text-gray-500">UTM Link:</div>
                    <a className="flex-1 text-black text-sm px-3 py-2 break-all">
                      https://www.example.com?utm_source=adit&utm_medium=video&utm_campaign=spring_sale
                    </a>
                    <Copy className="text-blue-600 hover:text-blue-800 mr-90 cursor-pointer" />
                  </div>
                </div>

                {/* Info Grid: left and right columns below UTM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                  {/* Left Column */}
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-[130px] text-gray-500">Duration:</span>
                      <span>55 seconds</span>
                    </div>
                    <div className="flex">
                      <span className="w-[130px] text-gray-500">
                        Campaign Length:
                      </span>
                      <span>{campaign.date}</span>
                    </div>
                    <div className="flex">
                      <span className="w-[130px] text-gray-500">
                        Categories:
                      </span>
                      <span>{campaign.category}</span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-[160px] text-gray-500">
                        Target Audience Age:
                      </span>
                      <span>18–35 years</span>
                    </div>
                    <div className="flex">
                      <span className="w-[160px] text-gray-500">
                        Target Audience Gender:
                      </span>
                      <span>Female Only</span>
                    </div>
                    <div className="flex">
                      <span className="w-[160px] text-gray-500">
                        Target Audience Locations:
                      </span>
                      <span>AL, GA, FL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isCampaignExpired && showExpiredAlert && (
            <div className="bg-red-50 border-1 rounded-xl border-red-500 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-8 bg-red-100 rounded-full">
                    <CircleAlert className="h-10 w-10 text-red-800" />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xl text-gray-800">
                        Campaign Duration Expired
                      </p>
                    </div>
                    <p className="text-sm w-200 text-gray-600 mt-1">
                      Your set campaign duration has expired, but you still have
                      $600 remaining in your budget. The campaign will remain
                      paused until the full budget is spent. You can update the
                      campaign duration or pause it at any time.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={handleEndCampaign}
                    className="px-14 py-5 text-sm bg-white text-red-500 border-1 border-red-500 rounded-full hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    End
                  </button>
                  <button
                    onClick={handleReactivateCampaign}
                    className="px-10 py-2 text-sm  bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Reactivate
                  </button>
                </div>
              </div>
            </div>
          )}

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
            <div className="bg-white p-6 rounded-xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quiz details
              </h2>

              {/* Quiz Info */}
              <div className="mb-20">
                <h3 className="text-gray-500 text-sm font-medium mb-2">
                  QUIZ INFO
                </h3>
                <div className="bg-[var(--bg-color-off-white)] p-10 rounded-xl">
                  <p className="text-gray-700 text-sm">
                    What is the primary purpose of blockchain technology in
                    cryptocurrency?
                  </p>
                  <hr className="border-t mb-4 border-gray-300" />

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
              
              <BarCharts />
              <div className="grid grid-cols-3 ml-20 text-sm text-gray-600 w-full max-w-md">
                <div>🔵 Male</div>
                <div>🟣 Female</div>
                <div>🟢 Prefer Not to Say</div>
              </div>
            </div>

            {/* Survey Details */}
            <div className="bg-white p-6 rounded-xl">
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
                <div className="p-5 rounded-xl bg-[var(--bg-color-off-white)]">
                  <span className="text-md text-gray-800">
                    How satisfied are you with the earning opportunities
                    provided by Aditt?
                  </span>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={25}
                      fill="bg-white rounded-xl"
                      text={{ left: "Very Satisfied", right: "25%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={60}
                      fill="bg-white rounded-xl"
                      text={{ left: "Satisfied", right: "60%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={45}
                      fill="bg-white rounded-xl"
                      text={{ left: "Neutral", right: "45%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{ left: "Dissatisfied", right: "30%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{ left: "Very Dissatisfied", right: "30%" }}
                    />
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
                <div className="p-5 rounded-xl bg-[var(--bg-color-off-white)]">
                  <span className="text-md text-gray-800">
                    How satisfied are you with the earning opportunities
                    provided by Aditt?
                  </span>

                  <div className="p-1 relative">
                    <ProgressBar
                      value={25}
                      fill="bg-white rounded-xl"
                      text={{ left: "Very Satisfied", right: "25%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={60}
                      fill="bg-white rounded-xl"
                      text={{ left: "Satisfied", right: "60%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={45}
                      fill="bg-white rounded-xl"
                      text={{ left: "Neutral", right: "45%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{ left: "Dissatisfied", right: "30%" }}
                    />
                  </div>
                  <div className="p-1 relative">
                    <ProgressBar
                      value={30}
                      fill="bg-white rounded-xl"
                      text={{ left: "Very Dissatisfied", right: "30%" }}
                    />
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
              <h2 className="text-l text-gray-400 font-light mb-2">
                Ad Clicks
              </h2>
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
              <div className="w-full">
                <AreaCharts />
              </div>
            </div>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1  md:col-span-2 bg-white p-6 rounded-xl border">
              <BarCharts />
            </div>
            <div className="col-span-1  bg-white p-6 rounded-xl border">
              <h3 className="text-gray-600 text-xl font-bold mb-3">
                Gender breakdown
              </h3>
              <h3 className="text-gray-500 text-sm font-medium mb-3">
                Percentage of users based on gender
              </h3>
              <PieCharts />
              <div className="grid grid-cols-3 text-sm text-gray-600 w-full max-w-md">
                <div>🔵 Male</div>
                <div>🟣 Female</div>
                <div>🟢 Prefer Not to Say</div>
              </div>
            </div>
          </div> */}
        </div>
        <ConfirmationDialogue
          open={dialogOpen}
          title={dialogConfig.title}
          smallText={dialogConfig.smallText}
          confirmLabel={dialogConfig.confirmLabel}
          onConfirm={() => {
            dialogConfig.onConfirm();
            setDialogOpen(false);
          }}
          onCancel={() => setDialogOpen(false)}
        />
      </main>
    </>
  );
}
