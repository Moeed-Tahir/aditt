"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import SignUpVerifyEmail from "@/components/auth/SignUpVerifyEmail";
import { SignupSidebar } from "@/components/SignupSidebar";

export default function VerifyEmails() {
  return (
    <SidebarProvider>
      <SignupSidebar />
      <SignUpVerifyEmail />
    </SidebarProvider>
  );
}