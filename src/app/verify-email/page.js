"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import SignUpVerifyEmail from "@/components/SignUpVerifyEmail";
import { SignupSidebar } from "@/components/SignupSidebar";

export default function VerifyEmails() {
  return (
    <SidebarProvider>
      <SignupSidebar />
      <SignUpVerifyEmail />
    </SidebarProvider>
  );
}