import React, { useState } from "react";

const Sliders = ({
  min = 0,
  max = 100,
  defaultValue = 50,
  showLabel = true,
  showRadio = false,
  radioOptions = [],
  labelUnit = "%",
}) => {
  const [value, setValue] = useState(defaultValue);
  const [selectedRadio, setSelectedRadio] = useState(
    radioOptions[0]?.value || ""
  );

  const handleSliderChange = (e) => {
    setValue(Number(e.target.value));
  };

  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Slider with moving label */}
      <div className="relative mt-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full"
        />
        {showLabel && (
          <div
            className="absolute top-[-1.5rem] text-sm font-medium text-blue-700"
            style={{
              left: `calc(${((value - min) / (max - min)) * 100}% - 20px)`,
              transition: "left 0.2s",
            }}
          >
            {value}
            {labelUnit} {selectedRadio}
          </div>
        )}
        {/* Min and Max labels below slider */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Optional radio buttons */}
      {showRadio && radioOptions.length > 0 && (
        <div className="flex gap-6">
          {radioOptions.map((option) => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name="slider-radio"
                value={option.value}
                checked={selectedRadio === option.value}
                onChange={handleRadioChange}
                className="form-radio"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sliders;
