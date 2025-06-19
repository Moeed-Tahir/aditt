"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import Navbar2 from "@/components/Navbar2";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CircleDot,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import Cookies from "js-cookie";
import AlertBox from "@/components/AlertBox";
import Step1 from "@/components/edit-campaign/Step1";
import Step2 from "@/components/edit-campaign/Step2";
import Step3 from "@/components/edit-campaign/Step3";
import Step4 from "@/components/edit-campaign/Step4";
import { toast } from "sonner";

const supabaseUrl = "https://rixdrbokebnvidwyzvzo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpeGRyYm9rZWJudmlkd3l6dnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MjMzMzIsImV4cCI6MjA0ODE5OTMzMn0.Zhnz5rLRoIhtHyF52pFjzYijNdxgZBvEr9LtOxR2Lhw";
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
  const [alert, setAlert] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const [formData, setFormData] = useState({
    brandName: "",
    engagements: {
      totalCount: 0
    },
    clickCount: {
      totalCount: 0,
      dailyCounts: []
    },
    _id: "",
    userId: "",
    campaignTitle: "",
    status: "",
    websiteLink: "",
    videoFile: {},
    videoUrl: "",
    imageFile: {},
    imageUrl: "",
    videoDuration: "",
    genderRatio: 50,
    genderType: "",
    ageRange: [15, 45],
    categories: [],
    quizQuestion: {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null
    },
    surveyQuestion1: {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null
    },
    surveyQuestion2: {
      text: "",
      options: ["", "", "", ""],
      correctAnswer: null
    },
    startDate: new Date(),
    endDate: new Date(),
    budget: 0,
    campignBudget: 0,
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
    totalViews: 0,
    impressions: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0,
    cardType: "",
    cardAdded: false,
    isFormOpen: false,
    bankAdded: false,
    isBankFormOpen: false,
    campaignVideoUrl: "",
    companyLogo: "",
    campaignStartDate: new Date(),
    campaignEndDate: new Date(),
    cardDetail: {
      cardNumber: "",
      cvc: "",
      nameOnCard: "",
      dateOnCard: "",
      country: "",
      zip: "",
      _id: ""
    },
    bankDetail: {
      accountNumber: "",
      routingNumber: "",
      accountType: "",
      _id: ""
    },
    campaignBudget: "0"
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

    setIsUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `addit-assets/${type}s/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("new-project")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: type === "video" ? "video/mp4" : "image/jpeg",
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from("new-project").getPublicUrl(filePath);

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
      const updatedCampaignData = {
        brandName: formData.brandName,
        campaignTitle: formData.campaignTitle,
        websiteLink: formData.websiteLink,
        campaignBudget: formData.budget.toString(),
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
          answer: formData.quizQuestion.options[formData.quizQuestion.correctAnswer],
        },
        surveyQuestion1: {
          questionText: formData.surveyQuestion1.text,
          option1: formData.surveyQuestion1.options[0],
          option2: formData.surveyQuestion1.options[1],
          option3: formData.surveyQuestion1.options[2],
          option4: formData.surveyQuestion1.options[3],
          answer: formData.surveyQuestion1.options[formData.surveyQuestion1.correctAnswer],
        },
        surveyQuestion2: {
          questionText: formData.surveyQuestion2.text,
          option1: formData.surveyQuestion2.options[0],
          option2: formData.surveyQuestion2.options[1],
          option3: formData.surveyQuestion2.options[2],
          option4: formData.surveyQuestion2.options[3],
          answer: formData.surveyQuestion2.options[formData.surveyQuestion2.correctAnswer],
        },
        genderType: formData.genderType,
        genderRatio: formData.genderRatio.toString(),
        ageRange: formData.ageRange,
        campaignStartDate: formData.startDate.toISOString(),
        campaignEndDate: formData.endDate ? formData.endDate.toISOString() : null,
        status: "Pending",
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
        "/api/routes/v1/campaignRoutes?action=updateCampaign",
        {
          ...updatedCampaignData,
          id: formData._id
        },
      );
      setShowSuccessModal(true);
    } catch (error) {
      console.log("Error is occured", error);
      toast.error(error?.response?.data?.message || "Error is occur");

    }
  };

  const handleQuestionChange = (questionType, field, value, optionIndex = null) => {
    setFormData((prev) => {
      if (optionIndex !== null) {
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
        return {
          ...prev,
          [questionType]: {
            ...prev[questionType],
            [field]: value,
          },
        };
      } else {
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

  useEffect(() => {
    if (searchParams) {
      const dataParam = searchParams.get('data');
      if (dataParam) {
        try {
          const parsedData = JSON.parse(decodeURIComponent(dataParam));

          const transformedData = {
            ...parsedData,
            engagements: parsedData.engagements || { totalCount: 0 },
            clickCount: parsedData.clickCount || { totalCount: 0, dailyCounts: [] },
            brandName: parsedData.brandName || {},
            videoFile: parsedData.videoFile || {},
            imageFile: parsedData.imageFile || {},
            videoUrl: parsedData.campaignVideoUrl || parsedData.videoUrl || "",
            imageUrl: parsedData.companyLogo || parsedData.imageUrl || "",
            quizQuestion: {
              text: parsedData.quizQuestion?.text || parsedData.quizQuestion?.questionText || "",
              options: parsedData.quizQuestion?.options || [
                parsedData.quizQuestion?.option1 || "",
                parsedData.quizQuestion?.option2 || "",
                parsedData.quizQuestion?.option3 || "",
                parsedData.quizQuestion?.option4 || "",
              ],
              correctAnswer: parsedData.quizQuestion?.correctAnswer ??
                (parsedData.quizQuestion?.options
                  ? parsedData.quizQuestion?.options.indexOf(parsedData.quizQuestion?.answer)
                  : null)
            },
            surveyQuestion1: {
              text: parsedData.surveyQuestion1?.text || parsedData.surveyQuestion1?.questionText || "",
              options: parsedData.surveyQuestion1?.options || [
                parsedData.surveyQuestion1?.option1 || "",
                parsedData.surveyQuestion1?.option2 || "",
                parsedData.surveyQuestion1?.option3 || "",
                parsedData.surveyQuestion1?.option4 || "",
              ],
              correctAnswer: parsedData.surveyQuestion1?.correctAnswer ??
                (parsedData.surveyQuestion1?.options
                  ? parsedData.surveyQuestion1?.options.indexOf(parsedData.surveyQuestion1?.answer)
                  : null)
            },
            surveyQuestion2: {
              text: parsedData.surveyQuestion2?.text || parsedData.surveyQuestion2?.questionText || "",
              options: parsedData.surveyQuestion2?.options || [
                parsedData.surveyQuestion2?.option1 || "",
                parsedData.surveyQuestion2?.option2 || "",
                parsedData.surveyQuestion2?.option3 || "",
                parsedData.surveyQuestion2?.option4 || "",
              ],
              correctAnswer: parsedData.surveyQuestion2?.correctAnswer ??
                (parsedData.surveyQuestion2?.options
                  ? parsedData.surveyQuestion2?.options.indexOf(parsedData.surveyQuestion2?.answer)
                  : null)
            },
            cardNumber: parsedData.cardDetail?.cardNumber || parsedData.cardNumber || "",
            monthOnCard: parsedData.cardDetail?.dateOnCard || parsedData.monthOnCard || "",
            cvc: parsedData.cardDetail?.cvc || parsedData.cvc || "",
            nameOnCard: parsedData.cardDetail?.nameOnCard || parsedData.nameOnCard || "",
            country: parsedData.cardDetail?.country || parsedData.country || "",
            zipCode: parsedData.cardDetail?.zip || parsedData.zipCode || "",
            bankAccountNumber: parsedData.bankDetail?.accountNumber || parsedData.bankAccountNumber || "",
            routingNumber: parsedData.bankDetail?.routingNumber || parsedData.routingNumber || "",
            accountType: parsedData.bankDetail?.accountType || parsedData.accountType || "",
            cardDetail: parsedData.cardDetail || {
              cardNumber: parsedData.cardNumber || "",
              cvc: parsedData.cvc || "",
              nameOnCard: parsedData.nameOnCard || "",
              dateOnCard: parsedData.monthOnCard || "",
              country: parsedData.country || "",
              zip: parsedData.zipCode || "",
              _id: parsedData.cardDetail?._id || ""
            },
            bankDetail: parsedData.bankDetail || {
              accountNumber: parsedData.bankAccountNumber || "",
              routingNumber: parsedData.routingNumber || "",
              accountType: parsedData.accountType || "",
              _id: parsedData.bankDetail?._id || ""
            }
          };

          setFormData(prev => ({
            ...prev,
            ...transformedData,
            genderRatio: parseInt(parsedData.genderRatio) || 50,
            genderType: parsedData.genderType || "",
            ageRange: Array.isArray(parsedData.ageRange) ? parsedData.ageRange : [18, 65], // Set ageRange here
            budget: parseFloat(parsedData.campaignBudget) || parseFloat(parsedData.budget) || 0,
            campignBudget: parseFloat(parsedData.campaignBudget) || 0,
            startDate: parsedData.campaignStartDate ? new Date(parsedData.campaignStartDate) : new Date(parsedData.startDate) || new Date(),
            endDate: parsedData.campaignEndDate ? new Date(parsedData.campaignEndDate) : new Date(parsedData.endDate) || new Date(),
            campaignStartDate: parsedData.campaignStartDate ? new Date(parsedData.campaignStartDate) : new Date(parsedData.startDate) || new Date(),
            campaignEndDate: parsedData.campaignEndDate ? new Date(parsedData.campaignEndDate) : new Date(parsedData.endDate) || new Date(),
            createdAt: parsedData.createdAt ? new Date(parsedData.createdAt) : new Date(),
            updatedAt: parsedData.updatedAt ? new Date(parsedData.updatedAt) : new Date(),
            cardAdded: !!parsedData.cardDetail,
            bankAdded: !!parsedData.bankDetail,
            categories: Array.isArray(parsedData.categories) ? parsedData.categories : [],
            videoDuration: parsedData.videoDuration || "0:00"
          }));

        } catch (error) {
          console.error("Error parsing campaign data:", error);
          // Optionally set some error state here
        }
      }
    }
  }, [searchParams]);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 userId={userId} />

      <div className="p-10">
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
                  className={`gap-2 h-10 flex items-center justify-start rounded-full text-xs font-medium px-4 ${index === currentStep
                    ? "border-blue-600 border bg-white text-gray-600"
                    : "bg-white text-gray-600"
                    } hover:cursor-pointer transition`}
                >
                  {index < currentStep ? (
                    <CircleCheck className="w-7 h-7 text-blue-600 shrink-0" />
                  ) : (
                    <CircleDot
                      className={`w-7 h-7 shrink-0 ${index === currentStep ? "text-blue-600" : "text-gray-300"
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

        {currentStep === 0 && (
          <Step1 uploadProgress={uploadProgress} handleInputChange={handleInputChange} formData={formData} isUploading={isUploading} handleFileChange={handleFileChange} />
        )}

        {currentStep === 1 && (
          <Step2 formData={formData} setFormData={setFormData} />
        )}

        {currentStep === 2 && (
          <Step3 formData={formData} handleQuestionChange={handleQuestionChange} />
        )}

        {currentStep === 3 && (
          <Step4 handleInputChange={handleInputChange} setFormData={setFormData} formData={formData} handleSubmit={handleSubmit} />
        )}
      </div>

      {alert.visible && (
        <AlertBox message={alert.message} type={alert.type} />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <Check className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-[24px] font-md text-gray-800 mb-2">
                Congratulations
              </h3>
              <p className="text-gray-600 text-[16px] mb-6">
                Your campaign is pending approval.Well notify you once its
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
