import SignUpVerifyEmail from "@/components/auth/SignUpVerifyEmail";
import { SignupSidebar } from "@/components/auth/SignupSidebar";
import React from "react";

function page() {
  return (
    <div className="flex flex-col items-center justify-center md:flex-row min-h-screen bg-gray-100">
      <SignupSidebar />
      <SignUpVerifyEmail />
    </div>
  );
}

export default page;
