"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export default function Calendars({ selected, onSelect, fromDate, className = "" }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSelectDate = (selectedDate) => {
    if (selectedDate) {
      onSelect(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Date Picker Trigger */}
      <div className="flex items-center mb-2">
        <span
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center w-full h-12 text-gray-600 text-m p-3 border rounded-full cursor-pointer"
        >
          <CalendarIcon className="mr-2 text-gray-500 w-5 h-5" />
          {selected ? selected.toLocaleDateString() : "Choose date"}
        </span>
      </div>

      {/* Calendar Popup */}
      {isCalendarOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white shadow-lg rounded-md border">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelectDate}
            fromDate={fromDate}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
