"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Mail, Lock, Info } from "lucide-react";
import FormField from "./FormField";
import useSigninForm from "@/hooks/useSigninForm";
import AuthButton from "./AuthButton";
import { toast } from "sonner";
import axios from "axios";

function SigninUser() {
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
    showAlert,
  } = useSigninForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const isAdmin =
        formData.email === "admin123@gmail.com" &&
        formData.password === "admin123$$";

      if (isAdmin) {
        Cookies.set("Role", "Admin", { expires: 1 });
        Cookies.set("email", "admin123@gmail.com", { expires: 1 });

        toast.success("Admin sign in successful!");
        router.push("/admin/dashboard");
      } else {
        const response = await axios.post("/api/routes/v1/authRoutes?action=signin", {
          email: formData.email,
          password: formData.password,
        });

        const data = response.data;

        if (data.token && data.user) {

          Cookies.set("token", data.token, { expires: 10 / (24 * 60) });
          Cookies.set("userId", data.user.userId, { expires: 1 });
          Cookies.set("user", JSON.stringify(data.user), { expires: 1 });
          Cookies.set("userEmail", data.user.email, { expires: 1 });

          toast.success("Sign in successful!");
          const userId = Cookies.get("userId");
          router.push(`/${userId}/campaign-dashboard`);
        } else {
          toast.error("Sign in successful but missing user data.");
        }
      }
    } catch (error) {
      console.error("Sign in error:", error);
      if (error.response) {
        if (error.response.data.code === "ACCOUNT_NOT_VERIFIED") {
          router.push("/verify-email");
          toast.message("Please verify your email to continue.");
        } else {
          toast.error(error.response.data.message || "An error occurred during sign in.");
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };


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
              Sign in to your Advertiser dashboard
            </p>
            <p className="text-[16px] text-[var(--text-light-color)] leading-6">
              Launch, track, and optimize your ad campaigns with ease.
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormField
              name="email"
              label="Business Email"
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

            <FormField
              name="password"
              label="Password"
              placeholder="Enter your password"
              Icon={Lock}
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.password}
              touched={touched.password}
              submitAttempted={submitAttempted}
            />

            <div className="flex justify-center gap-3 mt-2">
              <Link
                href="/reset-password"
                className="text-blue-500 hover:underline font-medium text-[16px]"
              >
                Forgot Password?
              </Link>
            </div>

            <AuthButton loading={loading} text={"Sign in"} />

            <div className="mt-4">
              <p className="text-gray-600">
                Don't have account?{" "}
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
