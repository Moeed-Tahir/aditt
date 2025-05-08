"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  AlertCircle,
  Lock,
  Info,
  MoveLeft,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

function SignUpVerifyEmail() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showCreatePassword, setCreatePassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      email: !formData.email
        ? "Email is required"
        : !isValidEmail(formData.email)
          ? "Invalid email format"
          : "",
      password:
        showCreatePassword && !formData.password ? "Password is required" : "",
      confirmPassword:
        showCreatePassword && formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
  
    // Validate OTP before proceeding
    if (otp.some((digit) => !digit)) {
      setOtpError("Please enter a valid 4-digit OTP.");
      setSubmitAttempted(false);
      return;
    }
  
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post('/api/routes/v1/authRoutes?action=verify-otp', {
        otp: otp.join(""), // Send OTP as a string
        userId: userId
      });
      alert("User is created");
    } catch (error) {
      alert("An error occurred: " + error.message); // Show specific error message
    } finally {
      setSubmitAttempted(false);
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
          className={`w-full border ${shouldShowError(name)
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
      {/* Right side content */}
      <div className="w-full h-auto min-h-screen bg-[var(--bg-color-off-white)] flex flex-col p-5 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 w-full">
          <button
            type="button"
            className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
            Back
          </button>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-5">
              <Image
                src="/resetpassword-mail.jpg"
                alt="reset"
                width={200}
                height={200}
              />
            </div>
            <div>
              <div className="flex justify-center items-center">
                <p className="text-[20px] font-bold text-black">
                  Verify your email
                </p>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-[16px] text-center font-light text-gray-600 py-6">
                  Please enter the 4 digit code that we’ve sent to your email: <span className="font-bold"> jhondoe@gmail.com    </span>            </p>
              </div>
            </div>

            <form className="flex flex-col gap-4" >

              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-semibold justify-center items-center flex text-[var(--text-dark-color)]">
                  {formData.email}
                </label>
                <div className="flex gap-4 justify-center">
                {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        placeholder="0"
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-18 h-18 text-center bg-white border border-[var(--border-color)] rounded-2xl text-4xl placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary-color)]"
                      />
                    ))}
                </div>
                {otpError && (
                  <p className="text-red-500 text-sm text-center mt-2">
                    {otpError}
                  </p>
                )}
              </div>

              <button
              onClick={handleSubmit}
                className="mt-4 w-full py-5 px-4 rounded-[58px] text-white font-semibold bg-blue-600 hover:bg-blue-700 cursor-pointer"
              > Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpVerifyEmail;
