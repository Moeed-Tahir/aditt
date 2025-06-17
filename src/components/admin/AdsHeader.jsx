"use client";

import Navbar from "@/components/Navbar";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { AdsVideoInfo } from "./AdsVideoInfo";
import { AdsQuizDetails } from "./AdsQuizDetails";
import { AdsSurveyDetails } from "./AdsSurveyDetails";

export function AdsHeader() {


  return (
    <div>

    <h1 className="text-[24px] text-gray-700">TESTING</h1>
    
    <p className="text-xs text-gray-500">Joingin Date: 14/02/2025</p>
    
    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-2">
      <p className="text-sm text-blue-600">
        Status: <span className="text-gray-600">Active</span>
      </p>
      <p className="text-sm text-blue-600">
        Business Email:{" "}
        <span className="text-gray-600">business@gmail.com</span>
      </p>
      <p className="text-sm text-blue-600">
        Business Website:{" "}
        <span className="text-gray-600">www.business.com</span>
      </p>
      <p className="text-sm text-blue-600">
        Ads Run: <span className="text-gray-600">10</span>
      </p>
      <p className="text-sm text-blue-600">
        Total Spent: <span className="text-gray-600">$500</span>
      </p>
    </div>
    </div>
  );
}
