import React from "react";

function PlatformGuidelines() {
  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white rounded-[24px] md:p-[40px] p-4 relative">
      <div className="flex flex-col md:flex-row items-start gap-4 md:gap-[130px] justify-between">
        <div className="w-full md:w-1/3">
          <p className="text-nowrap text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6">
            Platform Guidelines
          </p>
          <p className="block text-gray-400 md:text-[16px] md:leading-6 text-[14px] leading-4 mt-1">
            Learn about our rules and best practices to ensure a smooth and
            successful experience on our platform.
          </p>
        </div>
        <div className="w-full md:flex-1 flex flex-col gap-2 text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-4">
          <p className="font-bold mt-4">Content Policy</p>
          <span className="space-y-1">
            <li>
              Ensure all ad content complies with local laws and regulations.
            </li>
            <li>Avoid misleading, offensive, or inappropriate content.</li>
            <li>
              Content promoting illegal activities is strictly prohibited.
            </li>
          </span>

          <p className="font-bold mt-4">Ad Quality</p>
          <span className="space-y-1">
            <li>Use high-quality images and videos for better engagement.</li>
            <li>
              Ensure all links are functional and lead to legitimate
              destinations.
            </li>
          </span>

          <p className="font-bold mt-4">Payment and Budget</p>
          <span className="space-y-1">
            <li>
              Maintain sufficient funds in your account to avoid campaign
              interruptions.
            </li>
            <li>Monitor your spending and set budgets responsibly.</li>
          </span>

          <p className="font-bold mt-4">Targeting Guidelines</p>
          <span className="space-y-1">
            <li>
              Use precise targeting (e.g., age, gender, interests) to reach the
              right audience.
            </li>
            <li>Avoid discrimination or biased targeting practices.</li>
          </span>

          <p className="font-bold mt-4">Compliance</p>
          <span className="space-y-1">
            <li>
              Follow all GDPR, CCPA, and privacy regulations when collecting
              data from users.
            </li>
            <li>
              Include proper disclaimers when required (e.g., for surveys or
              data collection).
            </li>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PlatformGuidelines;
