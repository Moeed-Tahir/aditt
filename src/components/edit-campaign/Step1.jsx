"use client"
import Link from 'next/link';
import React from 'react'
import {
    Copy,
    Globe,
    House,
    Image,
    Trash,
    Upload,
    Video,
} from "lucide-react";

const Step1 = ({ formData, handleInputChange, isUploading, uploadProgress, handleFileChange, handleStepChange }) => {
    return (
        <>
            <div className="min-h-screen px-4 py-8">
                <div className="max-w-[1200px] w-full mx-auto bg-white rounded-2xl shadow p-8 relative">
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
                    <div className="flex items-center justify-between mb-8">
                        <div className="w-1/3">
                            <label className="block text-[24px] font-medium">
                                Campaign info
                            </label>
                            <span className="block text-[16px] text-gray-500 mt-1">
                                Add key details to set up and optimize your campaign.
                            </span>
                        </div>

                        <button
                            className={`bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${!formData.campaignTitle ||
                                    !formData.websiteLink ||
                                    (!formData.videoUrl && !formData.videoFile)
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                            onClick={() => {
                                if (
                                    formData.campaignTitle &&
                                    formData.websiteLink &&
                                    (formData.videoUrl || formData.videoFile)
                                ) {
                                    handleStepChange(1); 
                                }
                            }}
                            disabled={
                                !formData.campaignTitle ||
                                !formData.websiteLink ||
                                (!formData.videoUrl && !formData.videoFile)
                            }
                        >
                            Next
                        </button>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    <div className="space-y-6">

                        <div className="flex items-start gap-6">
                            <div className="w-1/3">
                                <label className="block text-[18px] text-gray-800 font-medium">
                                    Brand Name
                                </label>
                                <span className="block text-[16px] text-gray-400 mt-1">
                                    This is the name of the business or product the campaign represents.
                                </span>
                            </div>
                            <div className="relative flex-1">
                                <House className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="text"
                                    name="brandName"
                                    value={formData.brandName}
                                    onChange={handleInputChange}
                                    placeholder="Reebok promotion"
                                    className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2"
                                />
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />

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
                                    <p className="text-[16px] text-green-600 select-all truncate overflow-hidden whitespace-nowrap max-w-[250px]">
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
                                {formData.videoFile ? (
                                    <>
                                        <div className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10 flex items-center justify-center">
                                                <Video className="w-5 h-5 text-blue-500" />
                                            </div>

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

                                            <button
                                                onClick={() =>
                                                    handleInputChange({
                                                        target: {
                                                            name: "videoFile",
                                                            value: null
                                                        }
                                                    })
                                                }
                                                className="text-red-500 ml-auto"
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                    </>
                                ) : formData.videoUrl ? (
                                    <>
                                        <div className="flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10 flex items-center justify-center">
                                                <Video className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    Existing Video
                                                </span>
                                                <a
                                                    href={formData.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline"
                                                >
                                                    View Video
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleInputChange({
                                                        target: {
                                                            name: "videoUrl",
                                                            value: ""
                                                        }
                                                    });
                                                }}
                                                className="text-red-500 ml-auto"
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                        <div className="mt-4 border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                            <label className="cursor-pointer">
                                                <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                                                <p className="text-sm text-gray-700 mb-1">
                                                    Upload new video
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
                                    </>
                                ) : (
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
                                )}
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />

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
                                {formData.imageFile ? (
                                    <>
                                        <div className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10">
                                                <Image className="w-5 h-5 text-blue-500" />
                                            </div>

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

                                            <button
                                                onClick={() =>
                                                    handleInputChange({
                                                        target: {
                                                            name: "imageFile",
                                                            value: null
                                                        }
                                                    })
                                                }
                                                className="text-red-500 ml-auto"
                                            >
                                                <Trash />
                                            </button>
                                        </div>

                                        {isUploading && uploadProgress.image > 0 && (
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${uploadProgress.image}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </>
                                ) : formData.imageUrl ? (
                                    <>
                                        <div className="flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md">
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10">
                                                <Image className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    Existing Image
                                                </span>
                                                <a
                                                    href={formData.imageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline"
                                                >
                                                    View Image
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleInputChange({
                                                        target: {
                                                            name: "imageUrl",
                                                            value: ""
                                                        }
                                                    });
                                                }}
                                                className="text-red-500 ml-auto"
                                            >
                                                <Trash />
                                            </button>
                                        </div>
                                        <div className="mt-4 border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                            <label className="cursor-pointer">
                                                <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                                                <p className="text-sm text-gray-700 mb-1">
                                                    Upload new image
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
                                    </>
                                ) : (
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step1