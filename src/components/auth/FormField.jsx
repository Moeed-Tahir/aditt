"use client";
import React, { useState } from "react";
import { AlertCircle, Info, Eye, EyeOff } from "lucide-react";

const FormField = ({
  name,
  label,
  placeholder,
  Icon,
  type = "text",
  note = null,
  value,
  onChange,
  onBlur,
  error,
  touched,
  submitAttempted,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const shouldShowError = (touched || submitAttempted) && error;

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[16px] font-semibold text-[var(--text-dark-color)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full border ${
            shouldShowError ? "border-red-500" : "border-[var(--border-color)]"
          } rounded-[58px] p-4 pl-12 pr-12 focus:outline-none focus:border-[var(--primary-color)] placeholder:text-gray-400 placeholder:text-[16px] placeholder:leading-6`}
        />
        <Icon
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
            shouldShowError ? "text-red-500" : "text-gray-600"
          }`}
          size={20}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {shouldShowError && !isPassword && (
          <AlertCircle
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
            size={20}
          />
        )}
      </div>
      {note && (
        <div className="flex items-center gap-1 text-gray-500 text-sm pl-4">
          <Info size={14} />
          <p>{note}</p>
        </div>
      )}
      {shouldShowError && <p className="text-red-500 text-sm pl-4">{error}</p>}
    </div>
  );
};

export default FormField;