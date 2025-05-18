"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AlertBox from "../AlertBox";
import FormField from "./FormField";
import { toast } from "sonner";
import AuthButton from "./AuthButton";

function ResetPassword() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [alert, setAlert] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showCreatePassword, setCreatePassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [userId, setUserId] = useState(null);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

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
    setApiError("");
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setApiError("");

    if (!showOtp) {
      if (!validateForm()) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "/api/routes/v1/authRoutes?action=forgot-password",
          {
            email: formData.email,
          }
        );

        if (response.data) {
          setUserId(response.data.userId);
          setShowOtp(true);
          setResendTimer(30);
          toast.success("OTP sent to your email successfully!");
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        toast.error(error?.response?.data.message || "Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (showOtp && !showCreatePassword) {
      const fullOtp = otp.join("");
      const isOtpValid = /^\d{4}$/.test(fullOtp);

      if (!isOtpValid) {
        toast.error("Please enter a valid 4-digit OTP.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          "/api/routes/v1/authRoutes?action=verify-otp",
          {
            userId: userId,
            otp: fullOtp,
          }
        );

        if (response.data.message === "OTP verified successfully") {
          setCreatePassword(true);
          toast.success("OTP verified successfully!");
        } else {
          throw new Error(response.data.message || "OTP verification failed");
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (showCreatePassword) {
      if (!validateForm()) return;

      setLoading(true);
      try {
        const response = await axios.post(
          "/api/routes/v1/authRoutes?action=reset-password",
          {
            userId: userId,
            newPassword: formData.password,
          }
        );

        if (!response.data.message) {
          throw new Error(response.data.message || "Password reset failed");
        }

        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/signin-user");
        }, 2000);
      } catch (error) {
        console.error("Reset password error:", error);
        toast.error(error.response?.data?.message || "Failed to reset password. Please try again.");
      } finally {
        setLoading(false);
      }
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
  };

  const handleResendOtp = async () => {
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
          {!showOtp ? (
            <button
              type="button"
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
              Back
            </button>
          ) : showCreatePassword ? (
            <button
              type="button"
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
              onClick={() => {
                setCreatePassword(false);
              }}
            >
              <ArrowLeft />
              Back
            </button>
          ) : (
            <button
              type="button"
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 border hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
              onClick={() => {
                setShowOtp(false);
              }}
            >
              <ArrowLeft />
              Back
            </button>
          )}
          <p className="text-[20px] text-black">Reset Password</p>
          <div className="w-[60px]" />
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-5">
              <Image
                src={
                  !showOtp
                    ? "/resetpassword-lock.jpg"
                    : showCreatePassword
                      ? "/resetpassword-lock.jpg"
                      : "/resetpassword-mail.jpg"
                }
                alt="reset"
                width={200}
                height={200}
              />
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
                <p className="text-[16px] text-center font-light text-gray-600 py-6">
                  {!showOtp
                    ? "Enter your email address, and we'll send you instructions to reset your password."
                    : showCreatePassword
                      ? "Your new password must be secure and different from previous ones."
                      : "Please enter the 4 digit code that we've sent to your email."}
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {!showOtp ? (
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
              ) : showOtp && !showCreatePassword ? (
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
                  <div className="text-center mt-4">
                    {resendTimer > 0 ? (
                      <p className="text-gray-500 text-sm">
                        You can resend OTP in {resendTimer}s
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {otpError && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {otpError}
                    </p>
                  )}
                </div>
              ) : (
                <>
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
                </>
              )}
              {apiError && (
                <div className="text-red-500 text-sm text-center">
                  {apiError}
                </div>
              )}

              {successMessage && (
                <div className="text-green-500 text-sm text-center">
                  {successMessage}
                </div>
              )}

              <AuthButton
                loading={loading}
                text={
                  loading
                    ? "Processing..."
                    : !showOtp
                      ? "Continue"
                      : showCreatePassword
                        ? "Update"
                        : "Verify"
                }
              />
            </form>
          </div>
        </div>
        {alert.visible && (
          <AlertBox message={alert.message} type={alert.type} />
        )}
      </div>
    </div>
  );
}

export default ResetPassword;