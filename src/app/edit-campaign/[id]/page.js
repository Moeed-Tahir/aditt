"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback } from "react";
import Navbar2 from "@/components/Navbar2";
import QuestionBox from "../../../components/QuestionBox";
import Sliders from "@/components/Sliders";
import Calendars from "@/components/Calendars";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  CircleCheck,
  CircleDollarSign,
  CircleDot,
  Copy,
  Globe,
  House,
  Image,
  Tag,
  Trash,
  Upload,
  Video,
} from "lucide-react";
import PaymentMethod from "../../../components/PaymentMethod";
import LinkBankAccount from "../../../components/LinkBankAccount";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import AlertBox from "./AlertBox";
import Cookies from "js-cookie";


const supabaseUrl = "https://rixdrbokebnvidwyzvzo.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGRyYm9rZWJudmlkd3l6dnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjMzMzIsImV4cCI6MjA0ODE5OTMzMn0.Zhnz5rLRoIhtHyF52pFjzYijNdxgZBvEr9LtOxR2Lhw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function EditCampaign() {
  const steps = [
    { label: "Campaign Info" },
    { label: "Targeting Details" },
    { label: "Set Questions" },
    { label: "Campaign Budget" },
  ];

  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "0");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const userId = Cookies.get("userId");

  const [formData, setFormData] = useState({
    campaignTitle: "",
    websiteLink: "",
    videoFile: null,
    videoUrl: "",
    imageFile: null,
    imageUrl: "",
    videoDuration: "",

    genderRatio: 50,
    genderType: "",
    ageRange: [18, 65],
    genderAge: "12",
    categories: [],

    quizQuestion: {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null,
    },
    surveyQuestion1: {
      text: "",
      options: ["", "", "", ""],
      selectedAnswer: null,
    },
    surveyQuestion2: {
      text: "",
      options: ["", "", "", ""],
      selectedAnswer: null,
    },

    startDate: new Date(),
    endDate: null,
    budget: "",

    cardNumber: "",
    monthOnCard: "",
    cvc: "",
    nameOnCard: "",
    country: "",
    zipCode: "",

    bankAccountNumber: "",
    routingNumber: "",
    accountType: "",
    couponCode: "",
    age: "",
    campignBudget: "",
  });

  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    image: 0,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "budget") {
        const reach = calculateEstimatedReach();
        if (reach !== null) {
          newData.campignBudget = reach.toFixed(2);
        }
      }

      return newData;
    });
  };

  const handleFileUpload = useCallback(async (file, type) => {
    if (!file || !type) return;

    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `addit-assets/${type}s/${fileName}`;

    try {
      // First upload the file
      const { data, error } = await supabase.storage
        .from("new-project")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: type === "video" ? "video/mp4" : "image/jpeg",
        });

      if (error) throw error;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("new-project").getPublicUrl(filePath);

      let duration = "";
      if (type === "video") {
        duration = await getVideoDuration(file);
      }

      setFormData((prev) => ({
        ...prev,
        [`${type}Url`]: publicUrl,
        ...(type === "video" && { videoDuration: duration }),
      }));

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
    }
  }, []);

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        resolve(formatDuration(duration));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        [`${type}File`]: file,
      }));
      handleFileUpload(file, type);
    }
  };

  const handleSubmit = async () => {
    try {
      const campaignData = {
        campaignTitle: formData.campaignTitle,
        websiteLink: formData.websiteLink,
        campaignBudget: formData.campignBudget,
        campaignVideoUrl: formData.videoUrl,
        companyLogo: formData.imageUrl,
        userId: userId,
        couponCode: formData.couponCode,
        quizQuestion: {
          questionText: formData.quizQuestion.text,
          option1: formData.quizQuestion.options[0],
          option2: formData.quizQuestion.options[1],
          option3: formData.quizQuestion.options[2],
          option4: formData.quizQuestion.options[3],
          answer:
            formData.quizQuestion.options[formData.quizQuestion.correctAnswer],
        },
        surveyQuestion1: {
          questionText: formData.surveyQuestion1.text,
          option1: formData.surveyQuestion1.options[0],
          option2: formData.surveyQuestion1.options[1],
          option3: formData.surveyQuestion1.options[2],
          option4: formData.surveyQuestion1.options[3],
          answer:
            formData.surveyQuestion1.correctAnswer !== null
              ? formData.surveyQuestion1.options[
              formData.surveyQuestion1.correctAnswer
              ]
              : "",
        },
        surveyQuestion2: {
          questionText: formData.surveyQuestion2.text,
          option1: formData.surveyQuestion2.options[0],
          option2: formData.surveyQuestion2.options[1],
          option3: formData.surveyQuestion2.options[2],
          option4: formData.surveyQuestion2.options[3],
          answer:
            formData.surveyQuestion2.correctAnswer !== null
              ? formData.surveyQuestion2.options[
              formData.surveyQuestion2.correctAnswer
              ]
              : "",
        },
        genderType: formData.genderType,
        genderRatio: formData.genderRatio.toString(),
        age: formData.age,
        categories: formData.categories.join(","),
        campaignStartDate: formData.startDate.toISOString(),
        campaignEndDate:
          formData.endDate?.toISOString() || formData.startDate.toISOString(),
        cardDetail: {
          cardNumber: formData.cardNumber,
          cvc: formData.cvc,
          nameOnCard: formData.nameOnCard,
          dateOnCard: formData.monthOnCard,
          country: formData.country,
          zip: formData.zipCode,
        },
        bankDetail: {
          accountNumber: formData.bankAccountNumber,
          routingNumber: formData.routingNumber,
          accountType: formData.accountType,
        },
      };

      const response = await axios.post(
        "/api/routes/v1/campaignRoutes?action=createCampaign",
        campaignData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowSuccessModal(true);
      console.log("Campaign created successfully:", response.data);
    } catch (error) {
      console.error("Error creating campaign:", error);
      setAlert({
        message: "Failed to create campaign. Please check your form data.",
        type: "error",
        visible: true,
      });

      setTimeout(() => {
        setAlert(prev => ({ ...prev, visible: false }));
      }, 4000);

    }
  };

  const handleQuestionChange = (
    questionType,
    field,
    value,
    optionIndex = null
  ) => {
    setFormData((prev) => {
      if (optionIndex !== null) {
        // Updating an option
        const newOptions = [...prev[questionType].options];
        newOptions[optionIndex] = value;
        return {
          ...prev,
          [questionType]: {
            ...prev[questionType],
            options: newOptions,
          },
        };
      } else if (field === "correctAnswer" || field === "selectedAnswer") {
        // Updating the selected/correct answer
        return {
          ...prev,
          [questionType]: {
            ...prev[questionType],
            [field]: value,
          },
        };
      } else {
        // Updating the question text
        return {
          ...prev,
          [questionType]: {
            ...prev[questionType],
            text: value,
          },
        };
      }
    });
  };

  const calculateEstimatedReach = useCallback(() => {
    if (!formData.budget || !formData.videoDuration) return null;

    const budget = parseFloat(formData.budget);
    const [minutes, seconds] = formData.videoDuration.split(":").map(Number);
    const duration = minutes * 60 + seconds;

    if (isNaN(budget)) return null;
    if (isNaN(duration) || duration <= 0) return null;

    return (budget / duration) * 2;
  }, [formData.budget, formData.videoDuration]);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 userId={userId} />

      <div className="p-10">
        {/* Top Header with Back Button */}

        {/* Stepper */}
        <div className="max-w-6xl mx-auto">
          <div className="relative flex items-center mb-10 justify-between">
            <Link
              href={`/${userId}/campaign-dashboard`}
              className="py-2 px-5 ml-5 rounded-full bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition flex items-center gap-2"
            >
              <ArrowLeft />
              Back
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 font-md text-[24px]">
              Edit Campaigns
            </div>
            <div className="w-[90px]" />
          </div>
          <div className="flex items-center justify-between relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center"
              >
                <Link
                  href={`?step=${index}`}
                  className={` gap-2 h-10 flex items-center justify-start rounded-full text-xs font-medium px-4 ${index === currentStep
                      ? "border-blue-600 border bg-white text-gray-600"
                      : "bg-white text-gray-600"
                    } hover:cursor-pointer transition`}
                >
                  {index < currentStep ? (
                    <CircleCheck className="w-7 h-7 text-blue-600 shrink-0" /> // Tick icon for completed steps
                  ) : (
                    <CircleDot
                      className={`w-7 h-7 shrink-0 ${index === currentStep
                          ? "text-blue-600"
                          : "text-gray-300"
                        }`}
                    />
                  )}
                  {step.label}
                </Link>
              </div>
            ))}
            <div className="absolute top-5 left-[9%] right-[9%] h-0.5 bg-gray-300 z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-700"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Step 0: Campaign Info */}
        {currentStep === 0 && (
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-[1200px] w-full mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-[24px] font-medium">
                    Campaign info
                  </label>
                  <span className="block text-[16px] text-gray-500 mt-1">
                    Add key details to set up and optimize your campaign.
                  </span>
                </div>

                <Link
                  href="?step=1"
                  className={`bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${!formData.campaignTitle ||
                      !formData.websiteLink ||
                      !formData.videoFile
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                  onClick={(e) => {
                    if (
                      !formData.campaignTitle ||
                      !formData.websiteLink ||
                      !formData.videoFile
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              <div className="space-y-6">
                {/* Campaign Title */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Campaign Title
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Choose a clear and recognizable title to help identify
                      your campaign.
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      name="campaignTitle"
                      value={formData.campaignTitle}
                      onChange={handleInputChange}
                      placeholder="Reebok promotion"
                      className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Website/Product Link */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Website/Product Link
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Add your website or product link. A UTM link will be
                      auto-generated for tracking.
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="relative flex-1">
                      <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        name="websiteLink"
                        value={formData.websiteLink}
                        onChange={handleInputChange}
                        placeholder="https://shop.app/"
                        className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                      />
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[16px] text-green-600 select-all">
                        {formData.websiteLink || "https://www.example.com"}
                      </p>
                      {formData.websiteLink && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(formData.websiteLink)
                          }
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Video Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Campaign Video
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Upload your campaign video. For best results, we recommend
                      using vertical videos.
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Upload box */}
                    <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                      <label className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                        <p className="text-sm text-gray-700 mb-1">
                          Upload video
                        </p>
                        <p className="text-xs text-gray-500">Format: mp4</p>
                        <input
                          type="file"
                          accept="video/mp4"
                          onChange={(e) => handleFileChange(e, "video")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* File preview and progress bar - below the upload box */}
                    {formData.videoFile && (
                      <div className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                        {/* Video icon */}
                        <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10 flex items-center justify-center">
                          <Video className="w-5 h-5 text-blue-500" />
                        </div>

                        {/* File name and size */}
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formData.videoFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(formData.videoFile.size / (1024 * 1024)).toFixed(
                              1
                            )}{" "}
                            MB
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              videoFile: null,
                              videoUrl: "",
                            }))
                          }
                          className="text-red-500 ml-auto"
                        >
                          <Trash />
                        </button>
                      </div>
                    )}

                    {isUploading && uploadProgress.video > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress.video}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Image Upload */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Campaign Image (optional)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      This image will be used as a thumbnail for your campaign.
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Upload box */}
                    <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                      <label className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                        <p className="text-sm text-gray-700 mb-1">
                          Upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          Format: jpeg, jpg, png
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg, image/jpg, image/png"
                          onChange={(e) => handleFileChange(e, "image")}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* File preview and progress bar - now placed below the box */}
                    {formData.imageFile && (
                      <div className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                        {/* Image icon */}
                        <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10">
                          <Image className="w-5 h-5 text-blue-500" />
                        </div>

                        {/* File name and size */}
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {formData.imageFile.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(formData.imageFile.size / (1024 * 1024)).toFixed(
                              1
                            )}{" "}
                            MB
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              imageFile: null,
                              imageUrl: "",
                            }))
                          }
                          className="text-red-500 ml-auto"
                        >
                          <Trash />
                        </button>
                      </div>
                    )}

                    {isUploading && uploadProgress.image > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress.image}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Targeting Details */}
        {currentStep === 1 && (
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-[24px] font-medium">
                    Targeting Details
                  </label>
                  <span className="block text-[16px] text-gray-500 mt-1">
                    Reach the right people by setting up precise targeting for
                    your ads.
                  </span>
                </div>

                <Link
                  href="?step=2"
                  className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md  text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              <div className="space-y-6">
                {/* Gender Ratio */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Gender Ratio
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Define your preferred male-to-female ratio for ad
                      targeting.
                    </span>
                  </div>
                  <div className="relative bg-blue flex-1">
                    <Sliders
                      min={0}
                      max={100}
                      defaultValue={formData.genderRatio}
                      onChange={(value, selectedGender) =>
                        setFormData((prev) => ({
                          ...prev,
                          genderRatio: value,
                          genderType: selectedGender || prev.genderType,
                        }))
                      }
                      showLabel={true}
                      showRadio={true}
                      labelUnit="%"
                      radioOptions={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Age Range */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Age
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Select the age range of your target audience.
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="relative flex-1">
                      <Sliders
                        min={18}
                        max={65}
                        defaultValue={formData.age || 25}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            age: value,
                          }))
                        }
                        showLabel={true}
                        showRadio={false}
                        labelUnit={`yrs`}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Set Questions */}
        {currentStep === 2 && (
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-[24px] font-medium">
                    Set Questions
                  </label>
                  <span className="block text-[16px] text-gray-500 mt-1">
                    Add a quiz or survey for campaign insights.
                  </span>
                </div>
                <Link
                  href="?step=3"
                  className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md  text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                >
                  Next
                </Link>
              </div>

              <hr className="border-t mb-4 border-gray-300" />
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Quiz Question (optional)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Adit will create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox
                      question={formData.quizQuestion}
                      onChange={(field, value, optionIndex) =>
                        handleQuestionChange(
                          "quizQuestion",
                          field,
                          value,
                          optionIndex
                        )
                      }
                      isQuiz={true}
                      name="quizQuestion"
                    />
                  </div>
                </div>
                <hr className="border-t mb-4 border-gray-300" />
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Survey Question 1 (optional)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Adit will NOT create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox
                      question={formData.surveyQuestion1}
                      onChange={(field, value, optionIndex) =>
                        handleQuestionChange(
                          "surveyQuestion1",
                          field,
                          value,
                          optionIndex
                        )
                      }
                      isQuiz={true}
                      name="surveyQuestion1"
                    />
                  </div>
                </div>
                <hr className="border-t mb-4 border-gray-300" />
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Survey Question 2 (optional)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Adit will NOT create if you don't
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <QuestionBox
                      question={formData.surveyQuestion2}
                      onChange={(field, value, optionIndex) =>
                        handleQuestionChange(
                          "surveyQuestion2",
                          field,
                          value,
                          optionIndex
                        )
                      }
                      isQuiz={true}
                      name="surveyQuestion2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Campaign Budget */}
        {currentStep === 3 && (
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <div className="w-1/3">
                  <label className="block text-[24px] font-medium">
                    Campaign budget
                  </label>
                  <span className="block text-[16px] text-gray-500 mt-1">
                    Define your budget to maximize reach and performance.
                  </span>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md  text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>

              <hr className="border-t mb-4 border-gray-300" />

              <div className="space-y-6">
                {/* Campaign Start Date */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Campaign start date (Required)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Choose when you want your campaign to go live and start
                      reaching your audience.
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <Calendars
                      selected={formData.startDate}
                      onSelect={(date) => {
                        setFormData((prev) => ({
                          ...prev,
                          startDate: date,
                          // Reset end date if it's before or equal to the new start date
                          endDate:
                            prev.endDate && date >= prev.endDate
                              ? null
                              : prev.endDate,
                        }));
                      }}
                      fromDate={new Date()} // Disable dates before today
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign End Date */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Campaign end date (Optional)
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Choose an end date for your campaign or leave it
                      open-ended to run indefinitely.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <Calendars
                      selected={formData.endDate}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, endDate: date }))
                      }
                      fromDate={
                        formData.startDate
                          ? formData.startDate // allow same-day or future end date
                          : new Date() // allow today if no start date selected
                      }
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Campaign Budget */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Calculate campaign budget
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Define the total budget for your campaign.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <CircleDollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder="Enter campaign budget"
                      className="w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2"
                    />
                    {formData.budget && formData.videoDuration && (
                      <div className="mt-2 text-sm text-gray-500">
                        With a ${formData.budget} budget for your{" "}
                        {formData.videoDuration}-second video, you will reach
                        approximately {formData.campignBudget} unique users.
                      </div>
                    )}
                  </div>
                </div>
                <hr className="border-t mb-4 border-gray-300" />

                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Coupon Code
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Add Coupon code If you have.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                    <input
                      type="text"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleInputChange}
                      placeholder="Enter Coupon Code"
                      className="w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2"
                    />
                  </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                {/* Payment Info */}
                <div className="flex items-start gap-6">
                  <div className="w-1/3">
                    <label className="block text-[18px] text-gray-800 font-medium">
                      Payment Info
                    </label>
                    <span className="block text-[16px] text-gray-400 mt-1">
                      Choose a payment method to fund your campaign.
                    </span>
                  </div>

                  <div className="relative flex-1">
                    <PaymentMethod
                      value={{
                        cardNumber: formData.cardNumber,
                        monthOnCard: formData.monthOnCard,
                        cvc: formData.cvc,
                        nameOnCard: formData.nameOnCard,
                        country: formData.country,
                        zipCode: formData.zipCode,
                        cardType: formData.cardType,
                        cardAdded: formData.cardAdded,
                        isFormOpen: formData.isFormOpen,
                      }}
                      onChange={(paymentData) =>
                        setFormData((prev) => ({ ...prev, ...paymentData }))
                      }


                    />
                    <LinkBankAccount
                      value={{
                        bankAccountNumber: formData.bankAccountNumber,
                        routingNumber: formData.routingNumber,
                        accountType: formData.accountType,
                        bankAdded: formData.bankAdded,
                        isBankFormOpen: formData.isBankFormOpen,
                      }}
                      onChange={(bankData) =>
                        setFormData((prev) => ({ ...prev, ...bankData }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {alert.visible && (
        <AlertBox message={alert.message} type={alert.type} />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Check className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-[24px] font-md text-gray-800 mb-2">
                Congratulations
              </h3>
              <p className="text-gray-600 text-[16px] mb-6">
                Your campaign is pending approval.We'll notify you once its
                active.
              </p>
              <Link

                href={`/${userId}/campaign-dashboard`}
                className="bg-blue-600 w-full h-[45px] px-25 py-3 text-white rounded-full hover:bg-blue-700 transition"
              >
                Back to campaigns
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
