"use client";
import Image from "next/image";
import { Check, Mail } from "lucide-react";

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
    isActive: true,
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
    <div className="hidden md:flex flex-col min-h-screen w-full max-w-[480px] bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="px-8 py-10">
        <Image
          src="/Aditt logo.jpg"
          alt="logo"
          width={100}
          height={100}
          className="mb-5"
        />
      </div>

      {/* Vertical Stepper */}
      <div className="px-8 py-10 flex-1">
        <ol className="relative h-full pl-4 border-l-2 border-blue-600">
          {steps.map((step, index) => {
            const isLastStep = index === steps.length - 1;
            const isActive =
              step.completed || (!isLastStep && steps[index + 1]?.completed);
            const borderColor = isActive
              ? "border-blue-500"
              : "border-gray-300";

            return (
              <li key={step.id} className="mb-10 ml-6">
                <span
                  className={`absolute flex items-center justify-center w-8 h-8 bg-white rounded-full -left-4 border-2 ${borderColor}`}
                >
                  {step.completed ? (
                    <Check className="text-blue-600 w-4 h-4" />
                  ) : (
                    <div
                      className={`w-3 h-3 rounded-full ${
                        step.isActive ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </span>
                <h3 className="ml-2 text-[18px] leading-[28px] font-medium text-gray-800">
                  {step.name}
                </h3>
                <p className="ml-2 text-[16px] leading-6 text-gray-600 mt-1">
                  {step.subTitle}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Footer Section */}
      <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-800">aditt@2025</span>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-800" />
          <span className="text-sm text-gray-800">support@aditt.com</span>
        </div>
      </div>
    </div>
  );
}
