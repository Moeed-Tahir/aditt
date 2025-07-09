import { Copy, Globe, House, Image, Trash, Upload, Video } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const Step1 = ({
  handleFileChange,
  formData,
  setFormData,
  handleInputChange,
  isUploading,
  uploadProgress,
}) => {
  const [videoError, setVideoError] = useState("");
  const [imageError, setImageError] = useState("");

  const validateFileSize = (file, fileType) => {
    const maxSize = fileType === "video" ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      if (fileType === "video") {
        setVideoError(`File size too large. Maximum allowed size is ${fileType === "video" ? "100MB" : "10MB"}.`);
      } else {
        setImageError(`File size too large. Maximum allowed size is ${fileType === "video" ? "100MB" : "10MB"}.`);
      }
      return false;
    }
    if (fileType === "video") {
      setVideoError("");
    } else {
      setImageError("");
    }
    return true;
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = video.duration;
        if (duration > 30) {
          setVideoError("Video duration too long. Maximum allowed duration is 30 seconds.");
          resolve(false);
        } else {
          setVideoError("");
          resolve(true);
        }
      };
      
      video.onerror = () => {
        // If we can't get duration, we'll allow it but warn the user
        console.warn("Could not determine video duration");
        resolve(true);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFileSize(file, type)) {
      e.target.value = ""; 
      return;
    }

    if (type === "video") {
      const isValidDuration = await validateVideoDuration(file);
      if (!isValidDuration) {
        e.target.value = "";
        return;
      }
    }

    handleFileChange(e, type);
  };

  return (
    <>
      <div className="min-h-screen px-2 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 relative">
          {(isUploading && (uploadProgress.video > 0 || uploadProgress.image > 0)) && (
            <div className="bg-gray-100 rounded-t-xl md:rounded-t-2xl -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-4 md:mb-6 p-3">
              {uploadProgress.video > 0 && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>Uploading video...</span>
                    <span>{uploadProgress.video}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.video}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-lg md:text-[24px] font-medium">
                Campaign info
              </label>
              <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                Add key details to set up and optimize your campaign.
              </span>
            </div>

            <Link
              href="?step=1"
              className={`bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${
                !formData.campaignTitle ||
                !formData.brandName ||
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
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Brand Name
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  This is the name of the business or product the campaign
                  represents.
                </span>
              </div>
              <div className="relative w-full flex-1">
                <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Enter your Brand Name"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 md:py-3"
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Campaign Title
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  Choose a clear and recognizable title to help identify your
                  campaign.
                </span>
              </div>
              <div className="relative w-full flex-1">
                <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="campaignTitle"
                  value={formData.campaignTitle}
                  onChange={handleInputChange}
                  placeholder="Enter your campaign title"
                  className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 md:py-3"
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Website/Product Link
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  What is your call to action (CTA)?Add your website or product
                  link.(A UTM link is best for tracking)
                </span>
              </div>

              <div className="w-full flex-1">
                <div className="relative w-full">
                  <Globe className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  <input
                    type="url"
                    name="websiteLink"
                    value={formData.websiteLink}
                    onChange={handleInputChange}
                    placeholder="Enter website link"
                    className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 md:py-3"
                  />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm md:text-[16px] text-green-600 select-all truncate overflow-hidden whitespace-nowrap max-w-[250px]">
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

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Campaign Video
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  Upload your campaign video (max 100MB, max 30 seconds). For best results, we recommend
                  using vertical videos.
                </span>
              </div>

              <div className="w-full flex-1">
                <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-4 md:p-6 text-center">
                  <label className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                    <p className="text-xs md:text-sm text-gray-700 mb-1">
                      Upload video
                    </p>
                    <p className="text-xs text-gray-500">Format: mp4 (max 100MB, max 30 seconds)</p>
                    <input
                      type="file"
                      accept="video/mp4"
                      onChange={(e) => handleFileUpload(e, "video")}
                      className="hidden"
                    />
                  </label>
                </div>

                {videoError && (
                  <p className="text-red-500 text-sm mt-1">{videoError}</p>
                )}

                {formData.videoFile && (
                  <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4 border bg-white text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-md">
                    <div className="bg-blue-50 p-2 md:p-[10px] rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                      <Video className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                        {formData.videoFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(formData.videoFile.size / (1024 * 1024)).toFixed(1)}{" "}
                        MB
                      </span>
                    </div>

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
                      <Trash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Brand Logo
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  This logo will be used as a company logo for your campaign (max 10MB).
                </span>
              </div>

              <div className="w-full flex-1">
                <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-4 md:p-6 text-center">
                  <label className="cursor-pointer">
                    <Upload className="mx-auto mb-2 text-blue-500 w-5 h-5 md:w-6 md:h-6" />
                    <p className="text-xs md:text-sm text-gray-700 mb-1">
                      Upload image
                    </p>
                    <p className="text-xs text-gray-500">
                      Format: jpeg, jpg, png (max 10MB)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg, image/jpg, image/png"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageError && (
                  <p className="text-red-500 text-sm mt-1">{imageError}</p>
                )}

                {formData.imageFile && (
                  <div className="mt-3 md:mt-4 flex items-center gap-3 md:gap-4 border bg-white text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-md">
                    <div className="bg-blue-50 p-2 md:p-[10px] rounded-full w-8 h-8 md:w-10 md:h-10">
                      <Image className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                        {formData.imageFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(formData.imageFile.size / (1024 * 1024)).toFixed(1)}{" "}
                        MB
                      </span>
                    </div>

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
                      <Trash className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step1;