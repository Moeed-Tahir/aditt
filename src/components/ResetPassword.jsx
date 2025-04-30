"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Mail, AlertCircle, Lock, Info } from "lucide-react";
import Link from "next/link";

function ResetPassword() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showCreatePassword, setCreatePassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);

  const validateEmailDomain = (email, website) => {
    if (!website) return false;
    const domain = website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    return email.endsWith(`@${domain}`);
  };

  //   const validateForm = () => {
  //     const newErrors = {
  //       email: !formData.email
  //         ? "Email is required"
  //         : !validateEmailDomain(formData.email, formData.website)
  //         ? "Email must match your business domain"
  //         : "",
  //     };
  //     setErrors(newErrors);
  //     return !Object.values(newErrors).some((error) => error);
  //   };

  const validateForm = () => {
    setErrors({});
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!showOtp && validateForm()) {
      setShowOtp(true);
    } else if (showOtp && !showCreatePassword) {
      console.log("OTP submitted:", otp.join(""));
      setCreatePassword(true); // Move to password screen
    } else if (showCreatePassword) {
      console.log("New password submitted:", formData.password);
      // Handle final password submission logic here
    }
  };

  const shouldShowError = (name) => {
    return (touched[name] || submitAttempted) && errors[name];
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const renderField = (
    name,
    label,
    placeholder,
    Icon,
    type = "text",
    note = null
  ) => (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className="text-[16px] font-semibold text-[var(--text-dark-color)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full border ${
            shouldShowError(name)
              ? "border-red-500"
              : "border-[var(--border-color)]"
          } rounded-[58px] p-4 pl-12 focus:outline-none focus:border-[var(--primary-color)] placeholder:text-gray-400 placeholder:text-[16px] placeholder:leading-6`}
        />
        <Icon
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600"
          size={20}
        />
        {shouldShowError(name) && (
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
      {shouldShowError(name) && (
        <p className="text-red-500 text-sm pl-4">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="flex h-auto min-h-screen w-full">
      {/* Left side image */}
      <div className="md:flex w-[40%] h-auto min-h-screen relative hidden items-start justify-center">
        <Image
          src="/resetpassword.jpg"
          alt="signin"
          fill
          className="object-cover overflow-clip"
        />
      </div>

      {/* Right side content */}
      <div className="w-full md:w-[60%] h-auto min-h-screen bg-[var(--bg-color-off-white)] flex flex-col p-5 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 w-full">
          {!showOtp ? (
            <button
              type="button"
              className="text-gray-800 py-3 px-6 font-medium hover:underline rounded-[58px] bg-white"
              onClick={() => window.history.back()}
            >
              ← Back
            </button>
          ) : showCreatePassword ? (
            <button
              type="button"
              className="text-gray-800 py-3 px-6 font-medium hover:underline rounded-[58px] bg-white"
              onClick={() => {
                setCreatePassword(false);
              }}
            >
              ← Back
            </button>
          ) : (
            <button
              type="button"
              className="text-gray-800 py-3 px-6 font-medium hover:underline rounded-[58px] bg-white"
              onClick={() => {
                setShowOtp(false);
              }}
            >
              ← Back
            </button>
          )}
          <p className="text-[20px] text-black">Reset Password</p>
          <div className="w-[60px]" /> {/* Spacer */}
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-5">
              {!showOtp ? (
                <Image
                  src="/resetpassword-lock.jpg"
                  alt="resetpassword-lock"
                  width={200}
                  height={200}
                />
              ) : showCreatePassword ? (
                <Image
                  src="/resetpassword-lock.jpg"
                  alt="resetpassword-lock"
                  width={200}
                  height={200}
                />
              ) : (
                <Image
                  src="/resetpassword-mail.jpg"
                  alt="resetpassword-mail"
                  width={200}
                  height={200}
                />
              )}
            </div>
            <div>
              <div className="flex justify-center items-center">
                <p className="text-[20px] font-bold text-black">
                  {!showOtp
                    ? "Reset Your Password"
                    : showCreatePassword
                    ? "Create New Password"
                    : "Enter OTP"}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-[16px] text-center font-light text-gray-600">
                  {!showOtp
                    ? "Enter your email address, and we’ll send you instructions to reset your password."
                    : showCreatePassword
                    ? "Your new password must be secure and different from previous ones."
                    : "Please enter the 4 digit code that we’ve sent to your email."}
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {!showOtp ? (
                renderField(
                  "email",
                  "Email",
                  "Enter your business email",
                  Mail,
                  "email"
                )
              ) : showOtp && !showCreatePassword ? (
                // OTP input
                <div className="flex flex-col gap-2">
                  <label className="text-[16px] font-semibold justify-center items-center flex text-[var(--text-dark-color)]">
                    Enter OTP
                  </label>
                  <div className="flex gap-4 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center border border-[var(--border-color)] rounded-lg text-xl focus:outline-none focus:border-[var(--primary-color)]"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                // Password inputs
                <>
                  {renderField(
                    "password",
                    "New Password",
                    "Create your password",
                    Lock,
                    "password"
                  )}
                  {renderField(
                    "confirmPassword",
                    "Confirm Password",
                    "Confirm your password",
                    Lock,
                    "password"
                  )}
                </>
              )}

              <button
                type="submit"
                className="mt-4 w-full py-5 px-4 rounded-[58px] text-white font-semibold bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {!showOtp
                  ? "Continue"
                  : showCreatePassword
                  ? "Update"
                  : "Verify"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
