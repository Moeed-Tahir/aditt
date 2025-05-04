"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { ChatSupport } from "@/components/ChatSupport";

export default function AnalyticsDashboard() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <ChatSupport />
      </main>
    </>
  );
}
