"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import AuthButton from "./AuthButton";
import InternalHeader from "../InternalHeader";
import IconWithHeading from "./IconWithHeading";

function SignUpVerifyEmail() {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const otpInputRefs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.some((digit) => !digit)) {
      toast.error("Please enter all 4 digits of the OTP.");
      setOtpError(true);
      return;
    }

    const userId = Cookies.get("userId");
    if (!userId) {
      toast.error("User session not found. Please try signing up again.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=verify-otp",
        {
          otp: otp.join(""),
          userId: userId,
        }
      );

      if (response.data) {
        toast.success("Your email has been verified successfully");
        router.push(`/${userId}/campaign-dashboard`);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error occurred during verification"
      );
      setOtpError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(false);
    if (value && index < 3) {
      const nextInput = otpInputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    
    if (pastedData.length === 4) {
      const newOtp = pastedData.split('').slice(0, 4);
      setOtp(newOtp);
      setOtpError(false);
      
      const lastInput = otpInputRefs.current[3];
      if (lastInput) lastInput.focus();
    } else if (pastedData.length > 0) {
      toast.error("Please paste exactly 4 digits");
      setOtpError(true);
    }
  };

  const handleResendOtp = async () => {
    const userId = Cookies.get("userId");

    if (!userId) {
      toast.error("User session not found. Please try signing up again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=resend-otp",
        { userId }
      );

      if (response.data.message === "OTP resent successfully") {
        toast.success("New OTP has been sent to your email.");
        setResendTimer(30);
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userEmail = Cookies.get("userEmail");
    if (userEmail) {
      setFormData((prev) => ({ ...prev, email: userEmail }));
    }

    setResendTimer(30);
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  return (
    <div className="flex h-auto min-h-screen w-full">
      <div className="w-full h-auto min-h-screen bg-[var(--bg-color-off-white)] flex flex-col p-5 relative">
        <InternalHeader backLink="/signup-user" heading="Verify email" />

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md flex flex-col items-center justify-center gap-6">
            <IconWithHeading
              heading="Verify your email"
              subHeading="Please enter the 4 digit code that we've sent to your email:"
              email={formData.email}
            />

            <form
              className="flex flex-col gap-6 text-center w-full"
              onSubmit={handleSubmit}
            >
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
                      onPaste={handlePaste}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      className={`w-18 h-18 text-center bg-white border rounded-2xl text-4xl placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary-color)] ${
                        otpError
                          ? "border-red-500"
                          : "border-[var(--border-color)]"
                      }
                      ${otpError ? "text-red-500" : "text-gray-800"}`}
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
                    onClick={handleResendOtp}
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
        </div>
      </div>
    </div>
  );
}

export default SignUpVerifyEmail;