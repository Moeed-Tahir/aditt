"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, Globe, Mail, Lock, AlertCircle, Info } from "lucide-react";
import FormField from "./FormField";
import useSignupForm from "@/hooks/useSignupForm";
import { toast } from "sonner";
import AuthButton from "./AuthButton";

function SignupUser() {
  const router = useRouter();
  const {
    formData,
    errors,
    touched,
    submitAttempted,
    loading,
    setSubmitAttempted,
    setLoading,
    validateForm,
    handleChange,
    handleBlur,
  } = useSignupForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "/api/routes/v1/authRoutes?action=signUp",
        {
          name: formData.name,
          businessWebsite: formData.website,
          businessEmail: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;

      if (response.status === 200 && response.data.code === "OTP_RESENT") {
        Cookies.set("userId", response.data.userId, { expires: 1 });
        toast.warning("Account Exists. OTP resent");
        return;
      }

      if (data.token && data.user) {


        Cookies.set("token", data.token, {
          expires: 1,
          path: '/signin-user'
        });

        Cookies.set("userId", data.user.userId, { expires: 1 });
        Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
        Cookies.set("userEmail", data.user.email, { expires: 1 });

        toast.success(response.data.message);
        router.push(`/verify-email`);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 400) {
        if (error.response.data.code === "EMAIL_EXISTS") {
          toast.error("Email already exists. Please sign in or try again.");
          router.push(`/signin-user`);
        } else {
          toast.error("Validation Error", {
            description: error.response.data.message,
          });
        }
      } else {
        toast.error("Server Error", {
          description:
            error.response?.data?.message || "Please try again later",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-auto min-h-screen w-full">
      <div className="md:flex w-[40%] h-auto min-h-screen relative hidden items-start justify-center">
        <Image
          src="/signup.jpg"
          alt="signup"
          fill
          className="object-cover overflow-clip"
        />
      </div>
      <div className="w-full md:w-[60%] h-auto min-h-screen bg-[var(--bg-color)] flex items-center justify-center md:p-5 p-2">
        <div className="w-full max-w-[550px] bg-white rounded-[20px] md:px-8 px-2 py-9 flex flex-col gap-[20px] my-8">
          <Image
            src="/Aditt logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="mb-5"
          />
          <div>
            <p className="text-4xl leading-[50px] font-bold">
              Create your Advertiser account
            </p>
            <p className="text-[16px] text-[var(--text-light-color)] leading-6">
              Launch, Manage, and Optimize Your Ad Campaigns with Ease
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormField
              name="name"
              label="Name"
              placeholder="Enter your name"
              Icon={User}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              submitAttempted={submitAttempted}
            />

            <FormField
              name="website"
              label="Business Website"
              placeholder="Enter your business website"
              Icon={Globe}
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.website}
              touched={touched.website}
              submitAttempted={submitAttempted}
              note="Paste business website URL (e.g., https://www.example.com)"
            />

            <FormField
              name="email"
              label="Business Email"
              placeholder="Enter your business email"
              Icon={Mail}
              type="email"
              note="Email address must match your business domain."
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              submitAttempted={submitAttempted}
            />

            <FormField
              name="password"
              label="Create Password"
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

            <div className="flex items-start gap-3 mt-2">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
              </div>
              <label
                htmlFor="acceptTerms"
                className="text-[16px] font-normal text-gray-700"
              >
                Accept&nbsp;
                <Link
                  href="/guidelines"
                  className="text-blue-500 underline font-medium"
                >
                  Guidelines
                </Link>
                ,&nbsp;
                <Link
                  href="/terms-conditions"
                  className="text-blue-500 underline font-medium"
                >
                  Terms and Conditions
                </Link>
                , and&nbsp;
                <Link
                  href="/privacy-policy"
                  className="text-blue-500 underline font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
              {(touched.acceptTerms || submitAttempted) &&
                errors.acceptTerms && (
                  <AlertCircle className="text-red-500 ml-2" size={20} />
                )}
            </div>
            {(touched.acceptTerms || submitAttempted) && errors.acceptTerms && (
              <p className="text-red-500 text-sm pl-7 -mt-2">
                {errors.acceptTerms}
              </p>
            )}

            <AuthButton loading={loading} text="Sign up" />

            <div className="mt-4">
              <p className="text-gray-600">
                Have an account already?{" "}
                <Link
                  href="/signin-user"
                  className="text-blue-600 hover:underline font-bold cursor-pointer"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupUser;
