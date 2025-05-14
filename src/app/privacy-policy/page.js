"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mt-20 mx-auto mb-6">
        <div className="flex items-center mb-6">
          <Link
            href="/signup-user"
            className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
          >
            <ArrowLeft />
            Back
          </Link>

          <div className="flex-1 text-center text-lg font-medium">
            Privacy Policy
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 relative">
        <p className="block text-sm mb-3">
          Privacy policy, often referred to as T&C or Terms of Service
          (ToS), are a legal agreement between a company or service
          provider and its users or customers. They outline the rules,
          responsibilities, and obligations that both parties must adhere
          to when using a particular service, website, or product
        </p>
        <p className="block text-sm mb-3">
          Here are some key points typically covered in Terms and
          Conditions: Acceptance of Terms: Users are required to agree to
          the terms presented before using the service or product. User
          Obligations: The responsibilities and restrictions placed on
          users, such as providing accurate information, complying with
          applicable laws, and not engaging in illegal or harmful
          activities. Intellectual Property: Information regarding the
          ownership and protection of intellectual property, trademarks,
          copyrights, and other proprietary rights related to the service
          or product. Privacy and Data Collection: How user data is
          collected, stored, used, and protected. It may include details
          about cookies, tracking technologies, and the company&apos;s approach
          to handling personal information.
        </p>
        <p className="block text-sm mb-3">
          Privacy policy, often referred to as T&C or Terms of Service
          (ToS), are a legal agreement between a company or service
          provider and its users or customers. They outline the rules,
          responsibilities, and obligations that both parties must adhere
          to when using a particular service, website, or product
        </p>
        <p className="block text-sm mb-3">
          Privacy policy, often referred to as T&C or Terms of Service
          (ToS), are a legal agreement between a company or service
          provider and its users or customers. They outline the rules,
          responsibilities, and obligations that both parties must adhere
          to when using a particular service, website, or product{" "}
        </p>
        <p className="block text-sm mb-3">
          Here are some key points typically covered in Terms and
          Conditions: Acceptance of Terms: Users are required to agree to
          the terms presented before using the service or product. User
          Obligations: The responsibilities and restrictions placed on
          users, such as providing accurate information, complying with
          applicable laws, and not engaging in illegal or harmful
          activities. Intellectual Property: Information regarding the
          ownership and protection of intellectual property, trademarks,
          copyrights, and other proprietary rights related to the service
          or product. Privacy and Data Collection: How user data is
          collected, stored, used, and protected. It may include details
          about cookies, tracking technologies, and the companys approach
          to handling personal information.
        </p>
        <p className="block text-sm mb-3">
          Privacy policy, often referred to as T&C or Terms of Service
          (ToS), are a legal agreement between a company or service
          provider and its users or customers. They outline the rules,
          responsibilities, and obligations that both parties must adhere
          to when using a particular service, website, or product
        </p>
      </div>
    </div>
  );
}