"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useCallback } from "react";
import Navbar2 from "@/components/Navbar2";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CircleDot,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import AlertBox from "./AlertBox";
import Step1 from "./create-campaign/Step1";
import Step2 from "./create-campaign/Step2";
import Step3 from "./create-campaign/Step3";
import Step4 from "./create-campaign/Step4";
import { toast } from "sonner";

const supabaseUrl = "https://pcgpvkvbbyafxhsjszow.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjZ3B2a3ZiYnlhZnhoc2pzem93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODQwNzAsImV4cCI6MjA2NTY2MDA3MH0.Atj4LdjM56PgRrIQiI0WRJuU5krmpTDaajpWdoDsTDQ";
const supabase = createClient(supabaseUrl, supabaseKey);

export function CreateCampaigns({ userId }) {
  const steps = [
    { label: "Campaign Info" },
    { label: "Targeting Details" },
    { label: "Set Questions" },
    { label: "Campaign Budget" },
  ];

  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "0");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [values, setValues] = useState([13, 25]);

  const [formData, setFormData] = useState({
    brandName: "",
    campaignTitle: "",
    websiteLink: "",
    videoFile: null,
    videoUrl: "",
    imageFile: null,
    imageUrl: "",
    videoDuration: "",

    genderRatio: 50,
    genderType: "male",
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
    },
    surveyQuestion2: {
      text: "",
      options: ["", "", "", ""],
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
    cards: [],
    bankAccounts: [],

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
    const filePath = `aditt-assets/${type}s/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from("aditt")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: type === "video" ? "video/mp4" : "image/jpeg",
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("aditt").getPublicUrl(filePath);

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

  const [alert, setAlert] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const handleSubmit = async () => {
    try {
      const campaignData = {
        brandName: formData.brandName,
        campaignTitle: formData.campaignTitle,
        websiteLink: formData.websiteLink,
        campaignBudget: formData.budget,
        campaignVideoUrl: formData.videoUrl,
        companyLogo: formData.imageUrl,
        userId: userId,
        couponCode: formData.couponCode,
        quizQuestion: formData.quizQuestion.text ? {
          questionText: formData.quizQuestion.text,
          option1: formData.quizQuestion.options[0],
          option2: formData.quizQuestion.options[1],
          option3: formData.quizQuestion.options[2],
          option4: formData.quizQuestion.options[3],
          answer: formData.quizQuestion.correctAnswer !== null
            ? formData.quizQuestion.options[formData.quizQuestion.correctAnswer]
            : "",
        } : null,
        surveyQuestion1: formData.surveyQuestion1.text ? {
          questionText: formData.surveyQuestion1.text,
          option1: formData.surveyQuestion1.options[0],
          option2: formData.surveyQuestion1.options[1],
          option3: formData.surveyQuestion1.options[2],
          option4: formData.surveyQuestion1.options[3],
          
        } : null,
        surveyQuestion2: formData.surveyQuestion2.text ? {
          questionText: formData.surveyQuestion2.text,
          option1: formData.surveyQuestion2.options[0],
          option2: formData.surveyQuestion2.options[1],
          option3: formData.surveyQuestion2.options[2],
          option4: formData.surveyQuestion2.options[3],
        } : null,
        genderType: formData.genderType,
        genderRatio: formData.genderRatio.toString(),
        ageRange: formData.ageRange,
        categories: formData.categories.join(","),
        campaignStartDate: formData.startDate.toISOString(),
        campaignEndDate:
          formData.endDate?.toISOString() || null,
        cardDetails: formData.cards,
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
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(error?.response?.data?.message || "Error is occur");
    }
  };

  const calculateEstimatedReach = useCallback(() => {
    if (!formData.budget || !formData.videoDuration) return null;

    const budget = parseFloat(formData.budget);
    const [minutes, seconds] = formData.videoDuration.split(":").map(Number);
    const duration = minutes * 60 + seconds;

    if (isNaN(budget)) return null;
    if (isNaN(duration) || duration <= 0) return null;

    return (budget / duration) * 1000;
  }, [formData.budget, formData.videoDuration]);


  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 userId={userId} />

      <div className="px-0 py-4 md:p-10">
        {/* Stepper */}
        <div className="max-w-6xl mx-auto">
          <div className="relative flex items-center mb-6 md:mb-10 justify-between">
            <Link
              href={`/${userId}/campaign-dashboard`}
              className="py-2 px-4 md:px-5 md:ml-5 rounded-full bg-white text-gray-700 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Back</span>
            </Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-gray-800 font-md text-lg md:text-[24px]">
              Create Campaigns
            </div>
            <div className="w-[40px] md:w-[90px]" />
          </div>
          <div className="hidden md:flex items-center justify-start md:justify-between relative overflow-x-auto pb-4 gap-4 md:gap-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center min-w-[60px] md:min-w-0"
              >
                <Link
                  href={`?step=${index}`}
                  className={`gap-1 md:gap-2 h-10 flex items-center justify-center md:justify-start rounded-full text-xs font-medium px-2 md:px-4
          ${index === currentStep
                      ? "border-blue-600 border bg-white text-gray-600"
                      : "bg-white text-gray-600"
                    }
          hover:cursor-pointer transition`}
                >
                  {index < currentStep ? (
                    <CircleCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600 shrink-0" />
                  ) : (
                    <CircleDot
                      className={`w-5 h-5 md:w-6 md:h-6 shrink-0 ${index === currentStep
                        ? "text-blue-600"
                        : "text-gray-300"
                        }`}
                    />
                  )}
                  {/* Hide label on small screens, show on md+ */}
                  <span className="hidden md:inline whitespace-nowrap">
                    {step.label}
                  </span>
                </Link>
              </div>
            ))}
            {/* Progress bar behind steps */}
            <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-gray-300 z-0">
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
          <Step1 uploadProgress={uploadProgress} handleFileChange={handleFileChange} isUploading={isUploading} handleInputChange={handleInputChange} setFormData={setFormData} formData={formData} />
        )}

        {currentStep === 1 && (
          <Step2 setValues={setValues} values={values} setFormData={setFormData} formData={formData} />

        )}

        {currentStep === 2 && (
          <Step3 setFormData={setFormData} formData={formData} />
        )}

        {currentStep === 3 && (
          <Step4 handleInputChange={handleInputChange} setFormData={setFormData} handleSubmit={handleSubmit} formData={formData} />

        )}

        {alert.visible && (
          <AlertBox message={alert.message} type={alert.type} />
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg md:rounded-xl border border-md p-6 md:p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <Check className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mx-auto mb-3 md:mb-4" />
                <h3 className="text-lg md:text-[24px] font-md text-gray-800 mb-2">
                  Congratulations
                </h3>
                <p className="text-gray-600 text-sm md:text-[16px] mb-4 md:mb-6">
                  Your campaign is pending approval.We'll notify you once its
                  active.
                </p>
                <Link
                  href={`/${userId}/campaign-dashboard`}
                  className="bg-blue-600 w-full h-10 md:h-[45px] px-4 py-2 md:px-25 md:py-3 text-white rounded-full hover:bg-blue-700 transition text-sm md:text-base"
                >
                  Back to campaigns
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
