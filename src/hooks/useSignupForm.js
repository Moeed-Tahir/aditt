import { useState } from "react";

const useSignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    website: "",
    email: "",
    password: "",
    acceptTerms: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    website: false,
    email: false,
    password: false,
    acceptTerms: false,
  });

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: !formData.name ? "Name is required" : "",
      email: !formData.email ? "Email is required" : "",
      password: !formData.password
        ? "Password is required"
        : formData.password.length < 8
        ? "Password must be at least 8 characters"
        : "",
      acceptTerms: !formData.acceptTerms ? "You must accept the terms" : "",
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

  return {
    formData,
    errors,
    touched,
    submitAttempted,
    loading,
    showPassword,
    setShowPassword,
    setSubmitAttempted,
    setLoading,
    validateForm,
    handleChange,
    handleBlur,
  };
};

export default useSignupForm;