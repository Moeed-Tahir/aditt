"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Settings from "@/components/settings/Settings";

export default function AnalyticsDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full bg-[var(--bg-color-off-white)]">
        <Settings />
      </main>
    </SidebarProvider>
  );
}
