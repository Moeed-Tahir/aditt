"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

export default function Calendars({ selected, onSelect, fromDate, className = "" }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const containerRef = useRef(null);
  const calendarRef = useRef(null);

  const handleSelectDate = (selectedDate) => {
    if (selectedDate) {
      onSelect(selectedDate);
    } else {
      onSelect("");
    }
    setIsCalendarOpen(false);
  };

  const isValidDate = (date) => {
    if (date === "" || date === null || date === undefined) return false;
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj);
  };

  const getSelectedDate = () => {
    if (!isValidDate(selected)) return null;
    if (selected instanceof Date) return selected;
    try {
      return new Date(selected);
    } catch (e) {
      return null;
    }
  };

  const displayDate = getSelectedDate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isCalendarOpen && calendarRef.current && containerRef.current) {
      const calendarEl = calendarRef.current;
      const containerEl = containerRef.current;

      const containerRect = containerEl.getBoundingClientRect();
      const calendarRect = calendarEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      if (containerRect.left + calendarRect.width > viewportWidth) {
        calendarEl.style.left = "auto";
        calendarEl.style.right = "0";
        calendarEl.style.transform = "none";
      } else {
        calendarEl.style.left = "0";
        calendarEl.style.right = "auto";
      }
    }
  }, [isCalendarOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex items-center mb-2">
        <span
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center w-full h-12 text-gray-600 text-m p-3 border rounded-full cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <CalendarIcon className="mr-2 text-gray-500 w-5 h-5" />
          {displayDate ? displayDate.toLocaleDateString() : "Choose date"}
        </span>
      </div>

      {isCalendarOpen && (
        <div
          ref={calendarRef}
          className="absolute top-full right-0 z-50 mt-1 bg-white shadow-lg rounded-md border w-[250px]"
          style={{
            left: 'auto',
            right: '0'
          }}
        >
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleSelectDate}
            fromDate={fromDate}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}