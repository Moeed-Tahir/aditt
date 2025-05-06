"use client";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { Check, Dot } from "lucide-react";

const steps = [
  { id: 1, name: "Sign up", subTitle:"Create your account to get started on Aditt." , completed: true },
  { id: 2, name: "Business Category", subTitle:"Verify your business email to ensure secure and trusted access." , completed: false },
  { id: 3, name: "Payment Method", subTitle:"Complete your profile to optimize your campaign experience." , completed: false },
];

export function SignupSidebar() {
  return (
    <Sidebar className="min-h-screen">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <Image
              src="/Aditt logo.jpg"
              alt="logo"
              width={100}
              height={100}
              className="mb-5 py-6"
            />
          </SidebarGroupLabel>

          {/* Vertical Stepper */}
          <div className="px-8 py-20">
            
          <ol className="relative border-l-[3px] border-blue-600"> {/* Custom width */}
          {steps.map((step, index) => (
                <li key={step.id} className="mb-10 ml-6">
                  {step.completed ? (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-blue-600">
                      <Check className="text-blue-600"/>
                    </span>
                  ) : (
                    <span className="absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ring-blue-600">
                      <Dot className="text-blue-600"/>
                    </span>
                  )}
                  <h3 className={`ml-2 text-sm`}>
                    {step.name}
                  </h3>
                  <h3 className={`ml-2 text-xs text-gray-400`}>
                    {step.subTitle}
                  </h3>
                </li>
              ))}
            </ol>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}