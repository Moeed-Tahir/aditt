import { Mail, Lock } from "lucide-react";
import React from "react";

function IconWithHeading({ Icon, heading, subHeading, email }) {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 gap-6">
      <div className="w-[139px] h-[139px] bg-white rounded-full flex items-center justify-center">
        {Icon == "Lock" ? (
          <Lock className="w-[60px] h-[60px] text-blue-300" />
        ) : (
          <Mail className="w-[60px] h-[60px] text-blue-300" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-full gap-1">
        <p className="text-[20px] leading-[30px] font-bold text-gray-800 ">
          {heading}
        </p>
        <p className="text-[16px] leading-6 text-center font-normal text-gray-600">
          {subHeading}
          {email && (
            <span className="font-medium text-gray-800"> {email} </span>
          )}
        </p>
      </div>
    </div>
  );
}

export default IconWithHeading;
