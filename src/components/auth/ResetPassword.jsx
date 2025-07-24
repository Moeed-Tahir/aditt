// components/ResetPassword.jsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import FormField from "./FormField";
import AuthButton from "./AuthButton";
import IconWithHeading from "./IconWithHeading";
import VerifyOTP from "./VerifyOTP";

function ResetPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [currentStep, setCurrentStep] = useState("email");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [apiError, setApiError] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {
      email: !formData.email
        ? "Email is required"
        : !isValidEmail(formData.email)
        ? "Invalid email format"
        : "",
      password:
        currentStep === "password" && !formData.password
          ? "Password is required"
          : "",
      confirmPassword:
        currentStep === "password" &&
        formData.password !== formData.confirmPassword
          ? "Passwords do not match"
          : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setApiError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmitEmail = async () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=forgot-password",
        { email: formData.email }
      );

      if (response.data) {
        setUserId(response.data.userId);
        setCurrentStep("otp");
        setResendTimer(30);
        toast.success("OTP sent to your email successfully!");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error?.response?.data.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=verify-otp",
        { userId, otp }
      );

      if (response.data.message === "OTP verified successfully") {
        setCurrentStep("password");
        toast.success("OTP verified successfully!");
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    try {
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
    }
  };

  const handleResetPassword = async () => {
    setSubmitAttempted(true);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=reset-password",
        { userId, newPassword: formData.password }
      );

      if (!response.data.message) {
        throw new Error("Password reset failed");
      }

      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/signin-user"), 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "otp") setCurrentStep("email");
    else if (currentStep === "password") setCurrentStep("otp");
    else router.back();
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

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

      <div className="w-full md:w-[60%] h-auto min-h-screen bg-[var(--bg-color-off-white)] flex flex-col p-5 relative">
        <div className="flex items-center justify-between mb-6 w-full">
          <button
            type="button"
            className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
            onClick={handleBack}
          >
            <ArrowLeft />
            Back
          </button>
          <p className="text-[20px] text-black">Reset Password</p>
          <div className="w-[60px]" />
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[375px] flex flex-col items-center justify-center gap-6">
            {currentStep === "email" && (
              <>
                <IconWithHeading
                  Icon="Lock"
                  heading="Reset your password"
                  subHeading="Enter your email address, and we'll send you instructions to reset your password."
                />
                <form
                className="flex flex-col gap-2 w-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitEmail();
                  }}
                >
                  <FormField
                    name="email"
                    label="Email"
                    placeholder="Enter your business email"
                    Icon={Mail}
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    submitAttempted={submitAttempted}
                  />
                  <AuthButton
                    loading={loading}
                    text={loading ? "Sending..." : "Continue"}
                  />
                </form>
              </>
            )}

            {currentStep === "otp" && (
              <VerifyOTP
                email={formData.email}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                resendTimer={resendTimer}
                loading={loading}
                error={apiError}
              />
            )}

            {currentStep === "password" && (
              <>
                <IconWithHeading
                  Icon="Lock"
                  heading="Create New Password"
                  subHeading="Your new password must be secure and different from previous ones."
                />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleResetPassword();
                  }}
                  className="w-full flex flex-col gap-2"
                >
                  <FormField
                    name="password"
                    label="New Password"
                    placeholder="Create your password"
                    Icon={Lock}
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    touched={touched.password}
                    submitAttempted={submitAttempted}
                  />
                  <FormField
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    Icon={Lock}
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    submitAttempted={submitAttempted}
                  />
                  <AuthButton
                    loading={loading}
                    text={loading ? "Updating..." : "Update Password"}
                  />
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
