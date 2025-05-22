import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ value = 0, fill = "bg-blue-500", text }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="w-[100%] relative h-[80px]">
      <Progress value={progress} className={`h-[80px] bg-gray-600 ${fill}`} />
      {/* Left side text */}
      <span className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black px-2">
        {text && text.left}
      </span>
      {/* Right side text */}
      <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black px-2">
        {text && text.right}
      </span>
    </div>
  );
}
