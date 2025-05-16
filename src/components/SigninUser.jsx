"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User, Globe, Mail, Lock, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AlertBox from "./AlertBox";

function SigninUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    type: "", // 'success' | 'error' | 'info' | 'warning'
    visible: false,
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showAlert = (message, type) => {
    setAlert({
      message,
      type,
      visible: true,
    });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const validateForm = () => {
    const newErrors = {
      email: !formData.email
        ? "Email is required"
        : !isValidEmail(formData.email)
        ? "Invalid email format"
        : "",
      password: !formData.password ? "Password is required" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name] && value) {
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await fetch("/api/routes/v1/authRoutes?action=signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases
        if (data.message === "User not found") {
          showAlert(
            "No account found with this email address. Please sign up."
          );
        } else if (data.message === "Invalid password") {
          showAlert("Incorrect password. Please try again.");
        } else {
          showAlert(data.message || "Sign in failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      // If successful
      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("userId", data.user.userId, { expires: 1 });
      Cookies.set("user", JSON.stringify(data.user), { expires: 1 });

      const userId = Cookies.get("userId");
      router.push(`${userId}/campaign-dashboard`);
    } catch (error) {
      console.error("Sign in error:", error);
      showAlert("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const shouldShowError = (name) => {
    return (touched[name] || submitAttempted) && errors[name];
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
      {alert.visible && (
        <div className="fixed top-4 right-4 z-50">
          <AlertBox message={alert.message} type={alert.type} />
        </div>
      )}
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
      <div className="md:flex w-[40%] h-auto min-h-screen relative hidden items-start justify-center">
        <Image
          src="/signin.jpg"
          alt="signin"
          fill
          className="object-cover overflow-clip"
        />
      </div>
      <div className="w-full md:w-[60%] h-auto min-h-screen bg-[var(--bg-color)] flex items-center justify-center p-5">
        <div className="w-full max-w-[550px] bg-white rounded-[20px] px-8 py-9 flex flex-col gap-[20px] my-8">
          <Image
            src="/Aditt logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="mb-5"
          />
          <div>
            <p className="text-4xl leading-[50px] font-bold">
              Sign in to your Advertiser dashboard
            </p>
            <p className="text-[16px] text-[var(--text-light-color)] leading-6">
              Launch, track, and optimize your ad campaigns with ease.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {renderField(
              "email",
              "Business Email",
              "Enter your business email",
              Mail,
              "email"
            )}
            {renderField(
              "password",
              "Create Password",
              "Create your password",
              Lock,
              "password"
            )}
            {apiError && (
              <div className="text-red-500 text-sm text-center">{apiError}</div>
            )}

            <div className="flex justify-center gap-3 mt-2">
              <label
                htmlFor="acceptTerms"
                className="text-[16px] font-medium text-blue-500"
              >
                <Link
                  href="/reset-password"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full py-4 px-6 rounded-[58px] text-white font-semibold cursor-pointer flex items-center justify-center gap-2 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="mt-4">
              <p className="text-gray-600">
                Don’t have account?{" "}
                <Link
                  href="/signup-user"
                  className="text-blue-600 hover:underline font-bold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SigninUser;
