import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function InternalHeader({ backLink, heading }) {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="relative flex items-center justify-between mb-4 md:mb-10">
        <div className="w-max">
          <Link
            href={backLink}
            className="py-2 px-2 md:px-5 rounded-full bg-white text-gray-800 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 text-[16px] leading-6 w-max md:rounded-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back</span>
          </Link>
        </div>
        <div className="w-full text-gray-800 md:text-[24px] md:leading-8 font-medium text-[20px] leading-6 text-center">
          {heading}
        </div>
      </div>
    </div>
  );
}

export default InternalHeader;
