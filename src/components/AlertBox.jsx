import { useState } from "react";
import { Info } from "lucide-react";

export default function AlertBox({ message, type = "info" }) {
  const [visible, setVisible] = useState(true);

  const baseStyles = {
    info: "bg-blue-100 text-blue-800 border-blue-300",
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    error: "bg-white text-black",
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full">
      <div
        className={`flex items-center justify-between border rounded-xl px-4 py-3 shadow-md ${baseStyles[type]}`}
      >
        <div className="flex items-center space-x-2">
          <Info className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium">{message}</span>
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
