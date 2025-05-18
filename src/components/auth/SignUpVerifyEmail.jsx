"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AlertBox from "../AlertBox";
import { toast } from "sonner";
import AuthButton from "./AuthButton";

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false); 

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
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setOtpError("");

    if (otp.some((digit) => !digit)) {
      setOtpError("Please enter a valid 4-digit OTP.");
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
      console.error("OTP verification error:", error);
      toast.error(error?.response?.data?.message || "Error occurred during verification");
    } finally {
      setLoading(false);
    }
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
    setOtpError(""); // Clear error when user types
  };

  const [alert, setAlert] = useState({
    message: "",
    type: "", // 'success' | 'error' | 'info' | 'warning'
    visible: false,
  });

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
        setResendTimer(30); // Set timer for 30 seconds
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
    // Get email from cookies if available
    const userEmail = Cookies.get("userEmail");
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }

    // Initialize resend timer
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

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-5">
              <Image
                src="/resetpassword-mail.jpg"
                alt="reset"
                width={200}
                height={200}
                priority
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
                  Please enter the 4 digit code that we've sent to your email:{" "}
                  <span className="font-bold"> {formData.email} </span>
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              
              <div className="text-center mt-4">
                {resendTimer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    You can resend OTP in {resendTimer}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <AuthButton 
                loading={loading} 
                text={loading ? "Verifying..." : "Verify"} 
              />
            </form>
          </div>
        </div>
      </div>
      {alert.visible && <AlertBox message={alert.message} type={alert.type} />}
    </div>
  );
}

export default SignUpVerifyEmail;