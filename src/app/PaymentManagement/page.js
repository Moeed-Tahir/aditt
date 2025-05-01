"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

export default function PaymentManagementDashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Navbar />
        <div className="p-4">
          <h1 className="text-2xl font-bold">Payment Management</h1>
          {/* Add your payment management components here */}
        </div>
      </main>
    </SidebarProvider>
  );
}