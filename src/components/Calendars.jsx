"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export default function Calendars() {
  const [date, setDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSelectDate = (selectedDate) => {
    setDate(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <div>
      <div className="flex items-center mb-2">
        <span
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center w-120 h-12 text-gray-400 text-m p-3 border rounded-full cursor-pointer"
        >
          <CalendarIcon className="mr-2 text-gray-500 w-5 h-5" />
          {date ? date.toLocaleDateString() : "Choose date"}
        </span>
      </div>

      {isCalendarOpen && (
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelectDate}
          />
        </div>
      )}
    </div>
  );
}
