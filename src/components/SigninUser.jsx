"use client";
import React, { useState } from "react";
import Image from "next/image";
import { User, Globe, Mail, Lock, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

function SigninUser() {
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //   const validateForm = () => {
  //     const newErrors = {
  //       email: !formData.email
  //         ? "Email is required"
  //         : !isValidEmail(formData.email)
  //         ? "Email must match your business domain"
  //         : "",
  //       password: !formData.password
  //         ? "Password is required"
  //         : formData.password.length < 8
  //         ? "Password must be at least 8 characters"
  //         : "",
  //     };

  //     setErrors(newErrors);
  //     return !Object.values(newErrors).some((error) => error);
  //   };

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
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    // if (validateForm()) {
    //   // Submit form logic here
    //   console.log("Form submitted:", formData);
    // }
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

            <div className="flex justify-center gap-3 mt-2">
              <label
                htmlFor="acceptTerms"
                className="text-[16px] font-medium text-blue-500"
              >
                <Link
                  href="/ResetPassword"
                  className="text-blue-500 hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full py-4 px-6 rounded-[58px] text-white font-semibold bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              <Link href="/CampaignDashboard">Sign In</Link>
            </button>

            <div className="mt-4">
              <p className="text-gray-600">
                Don’t have account?{" "}
                <Link
                  href="/SignupUser"
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
