"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import AuthButton from "./AuthButton";
import IconWithHeading from "./IconWithHeading";

const VerifyOTP = ({
  email,
  onVerify,
  onResend,
  resendTimer,
  loading,
  error,
  onBack,
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 4 digits of the OTP.");
      setOtpError(true);
      return;
    }

    onVerify(otp.join(""));
  };

  return (
    <div className="w-full max-w-[375px] flex flex-col items-center justify-center gap-6">
      <IconWithHeading
        heading="Verify your email"
        subHeading="Please enter the 4 digit code that we've sent to your email:"
        email={email}
      />

      <form className="flex flex-col gap-6 text-center w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-4 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                placeholder="0"
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onFocus={(e) => e.target.select()}
                className={`w-18 h-18 text-center bg-white border rounded-2xl text-4xl placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary-color)] ${
                  otpError || error
                    ? "border-red-500"
                    : "border-[var(--border-color)]"
                } ${otpError || otpError ? "text-red-500" : "text-gray-800"}`}
                autoComplete="off"
              />
            ))}
          </div>
        </div>

        {resendTimer > 0 ? (
          <p className="text-gray-600 text-[14px] leading-5">
            You can resend OTP in {resendTimer}s
          </p>
        ) : (
          <div>
            <span className="text-[14px] leading-5 text-gray-600">
              {otpError && "Code doesn't match"}
            </span>
            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="text-blue-600 font-medium disabled:text-gray-400 disabled:cursor-not-allowed hover:underline"
            >
              Resend OTP
            </button>
          </div>
        )}

        <AuthButton
          loading={loading}
          text={loading ? "Verifying..." : "Verify"}
        />
      </form>
    </div>
  );
};

export default VerifyOTP;
