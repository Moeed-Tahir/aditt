"use client";

import React, { useState, useEffect } from "react";

const Sliders = ({
  min,
  max,
  defaultValue,
  onChange,
  showLabel,
  showRadio,
  labelUnit,
  radioOptions = [],
  selectedRadio: externalSelectedRadio, // receives "male" or "female"
}) => {
  const [value, setValue] = useState(defaultValue);
  const [selectedRadio, setSelectedRadio] = useState(externalSelectedRadio || "");

  useEffect(() => {
    setSelectedRadio(externalSelectedRadio || "");
  }, [externalSelectedRadio]);

  useEffect(() => {
    if (onChange) {
      onChange(value, selectedRadio); // sync on load too
    }
  }, [value, selectedRadio]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
  };

  const handleRadioChange = (e) => {
    const gender = e.target.value;
    setSelectedRadio(gender);
    onChange && onChange(value, gender);
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="text-sm">
          {value}
          {labelUnit}
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleSliderChange}
        className="w-full"
      />

      {showRadio && (
        <div className="flex gap-4 mt-2">
          {radioOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-1">
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={selectedRadio === option.value}
                onChange={handleRadioChange}
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sliders;
