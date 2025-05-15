"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Charts from "@/components/Charts";
import { LineBarsChart } from "@/components/LineBarsChart";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Globe,
  House,
  LandmarkIcon,
  Lock,
  Mail,
  Trash,
  Upload,
  User,
} from "lucide-react";
import ExpandableBars from "./ExpandableBars";
import Cookies from "js-cookie";

export function Support() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const userId = Cookies.get("userId");
  
  const options = [
    { value: "", label: "Select Profile" },
    { value: "agency", label: "Marketing Agency" },
    { value: "freelancer", label: "Freelancer" },
    { value: "corporate", label: "Corporate" },
  ];

  const handleSelect = (value, label) => {
    setSelected(label);
    setIsOpen(false);
  };
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />
        <div className="p-4 md:p-10">
          <div className="max-w-6xl mx-auto">
            <div className="relative flex items-center mb-4 md:mb-10 justify-between">
              <Link
                href={`/${userId}/campaign-dashboard`}
                className="py-2 px-4 md:px-5 md:ml-5 rounded-full bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Back</span>
              </Link>
              <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 font-md text-base md:text-[24px]">
                Help Center
              </div>
              <div className="w-[40px] md:w-[90px]" />
            </div>
          </div>
          <div className="w-full max-w-[1200px] mx-auto bg-white rounded-2xl mb-3 p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-lg font-medium">
                  Frequently Asked Questions
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Find answers to common questions about using our platform.
                </span>
              </div>
              <div className="w-full md:flex-1">
                <ExpandableBars />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[1200px] mx-auto bg-white rounded-2xl mb-3 p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-lg font-medium">
                  Still Have Questions?
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Chat with us for quick support and answers to your questions.
                </span>
              </div>

              <button className="bg-blue-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-full hover:bg-blue-700 w-full md:w-auto">
                <Link href="/chat-support">Chat with Support</Link>
              </button>
            </div>
          </div>

          <div className="w-full max-w-[1200px] mx-auto bg-white rounded-2xl mb-3 p-4 md:p-8 relative">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-lg font-medium">
                  Platform Guidelines
                </label>
                <span className="block text-xs text-gray-500 mt-1">
                  Learn about our rules and best practices to ensure a smooth
                  and successful experience on our platform.
                </span>
              </div>
              <div className="w-full md:flex-1">
                <div>
                  <label className="block text-base md:text-lg font-medium mt-2">
                    Content Policy
                  </label>
                  <span className="block text-xs md:text-sm text-gray-500 mt-1">
                    <li>
                      Ensure all ad content complies with local laws and
                      regulations.
                    </li>
                    <li>
                      Avoid misleading, offensive, or inappropriate content.
                    </li>
                    <li>
                      Content promoting illegal activities is strictly
                      prohibited.
                    </li>
                  </span>
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium mt-2">
                    Ad Quality
                  </label>
                  <span className="block text-xs md:text-sm text-gray-500 mt-1">
                    <li>
                      Use high-quality images and videos for better engagement.
                    </li>
                    <li>
                      Ensure all links are functional and lead to legitimate
                      destinations.
                    </li>
                  </span>
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium mt-2">
                    Payment and Budget
                  </label>
                  <span className="block text-xs md:text-sm text-gray-500 mt-1">
                    <li>
                      Maintain sufficient funds in your account to avoid
                      campaign interruptions.
                    </li>
                    <li>Monitor your spending and set budgets responsibly.</li>
                  </span>
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium mt-2">
                    Targeting Guidelines
                  </label>
                  <span className="block text-xs md:text-sm text-gray-500 mt-1">
                    <li>
                      Use precise targeting (e.g., age, gender, interests) to
                      reach the right audience.
                    </li>
                    <li>Avoid discrimination or biased targeting practices.</li>
                  </span>
                </div>
                <div>
                  <label className="block text-base md:text-lg font-medium mt-2">
                    Compliance{" "}
                  </label>
                  <span className="block text-xs md:text-sm text-gray-500 mt-1">
                    <li>
                      Follow all GDPR, CCPA, and privacy regulations when
                      collecting data from users.
                    </li>
                    <li>
                      Include proper disclaimers when required (e.g., for
                      surveys or data collection).
                    </li>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}