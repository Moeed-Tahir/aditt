import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ value = 0, fill = "bg-blue-500" }) {
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const timer = setTimeout(() => setProgress(value), 300);
      return () => clearTimeout(timer);
    }, [value]);
  
    return (
      <div className="w-[60%]">
        <Progress
          value={progress}
          className={`h-10 bg-gray-600 shadow-md ${fill}`}
        />

      </div>
    );
  }
  
