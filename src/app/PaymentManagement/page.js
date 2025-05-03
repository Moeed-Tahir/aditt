"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  ChevronDown,
  CircleDollarSign,
  CircleDot,
  Copy,
  Globe,
  House,
  Trash,
  Upload,
} from "lucide-react";

import PaymentMethod from "@/components/PaymentMethod";
import LinkBankAccount from "@/components/LinkBankAccount";

export default function PaymentManagementDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold">Payment Management</h1>
          <div className="min-h-screen px-4 py-8">
            {/* Form Section */}
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow mb-4 p-8 relative">
              <div className="space-y-6">
                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-xl font-bold">
                      Payment Info
                    </label>
                  </div>

                  <div className="relative flex-1">
                    <PaymentMethod />
                    <LinkBankAccount />
                  </div>
                </div>
              </div>
            </div>
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="space-y-6">
                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-xl font-bold">
                      Transactions
                    </label>
                  </div>

                  <div className="relative flex-1">
                    <div className="flex-1 rounded-lg p-6 text-center bg-[var(--bg-color-off-white)]">
                      <CircleDollarSign className="mx-auto mb-2 w-50 text-blue-500 h-50" />
                      <p className="text-4xl text-gray-700 mb-1">No transactions yet</p>
                      <p className="text-l text-gray-500">Your payment history will appear here once transactions are made.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
