import { useState } from "react";
import { Info, Check, X } from "lucide-react";

export default function AlertBox({ message, type = "info" }) {
  const [visible, setVisible] = useState(true);

  const baseStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-white text-black",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-white text-black",
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-600" />;
      case "error":
        return <Info className="w-5 h-5 text-red-600" />;
      case "warning":
        return <Info className="w-5 h-5 text-yellow-600" />;
      default: // info
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getText = () => {
    switch (type) {
      case "success":
        return <span className="font-medium">Success</span>;
      case "error":
        return <span className="font-medium">Error</span>;
      case "warning":
        return <span className="font-medium">Warning</span>;
      default: // info
        return <span className="font-medium">Default</span>;
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full">
      <div
        className={`flex items-center justify-between border rounded-[16px] px-[16px] gap-[16px] w-[431px] h-[80px] shadow-md ${baseStyles[type]}`}
      >
        <div className="flex items-start space-x-2">
          {getIcon()}
          <div className="flex flex-col">
            {getText()}
            <span className="text-[14px] text-gray-400">{message}</span>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-lg font-bold hover:text-gray-600"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
