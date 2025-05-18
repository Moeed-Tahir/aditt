"use client";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Check, Dot } from "lucide-react";

const steps = [
  {
    id: 1,
    name: "Sign up",
    subTitle: "Create your account to get started on Aditt.",
    completed: true,
  },
  {
    id: 2,
    name: "Business Category",
    subTitle: "Verify your business email to ensure secure and trusted access.",
    completed: false,
  },
  {
    id: 3,
    name: "Payment Method",
    subTitle: "Complete your profile to optimize your campaign experience.",
    completed: false,
  },
];

export function SignupSidebar() {
  return (
    <Sidebar className="min-h-screen w-[480px]">
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
            <ol
              className="relative h-[200px] pl-4 border-l-[3px]"
              style={{
                borderColor: steps[0].completed ? "#1564FF" : "#252B37",
              }}
            >
              {steps.map((step, index) => {
                const isLastStep = index === steps.length - 1;

                return (
                  <li key={step.id} className="mb-10 ml-6">
                    <span
                      className={`absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 ring-4 ${
                        isLastStep ? "ring-gray-400" : "ring-blue-600"
                      }`}
                    >
                      {step.completed ? (
                        <Check className="text-blue-600" />
                      ) : (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isLastStep ? "bg-gray-400" : "bg-blue-600"
                          }`}
                        />
                      )}
                    </span>
                    <h3 className="ml-2 text-sm">{step.name}</h3>
                    <h3 className="ml-2 text-xs text-gray-400">
                      {step.subTitle}
                    </h3>
                  </li>
                );
              })}
            </ol>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
