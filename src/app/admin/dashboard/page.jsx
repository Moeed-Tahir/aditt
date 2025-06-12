"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <AdminDashboard />
    </SidebarProvider>
  );
}
