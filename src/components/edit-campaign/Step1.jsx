"use client"
import React, { useState } from 'react'
import {
    Copy,
    Globe,
    House,
    Image,
    Trash,
    Upload,
    Video,
    X,
} from "lucide-react";

const Step1 = ({ formData, handleInputChange, uploadProgress, handleFileChange, handleStepChange }) => {
    const isDisabled = formData.status === "Active" || formData.status === "Paused";
    const [previewItem, setPreviewItem] = useState(null);

    return (
        <>
            {previewItem && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-medium">Preview</h3>
                            <button 
                                onClick={() => setPreviewItem(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-4 flex justify-center items-center max-h-[70vh] overflow-auto">
                            {previewItem.type === 'video' ? (
                                <video 
                                    src={previewItem.url} 
                                    controls 
                                    className="max-w-full max-h-full"
                                />
                            ) : (
                                <img 
                                    src={previewItem.url} 
                                    alt="Preview" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            )}
                        </div>
                        <div className="p-4 border-t text-sm text-gray-500">
                            <p>File name: {previewItem.name}</p>
                            {previewItem.size && (
                                <p>File size: {(previewItem.size / (1024 * 1024)).toFixed(1)} MB</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen px-4 py-8">
                <div className="max-w-[1200px] w-full mx-auto bg-white rounded-2xl shadow p-8 relative">
                    {(uploadProgress.video > 0 && uploadProgress.video < 100) ||
                        (uploadProgress.image > 0 && uploadProgress.image < 100) ? (
                        <div className="bg-gray-100 rounded-t-xl md:rounded-t-2xl -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-4 md:mb-6 p-3">
                            {uploadProgress.video > 0 && uploadProgress.video < 100 && (
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                                        <span>Uploading video...</span>
                                        <span>{uploadProgress.video}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                            style={{ width: `${uploadProgress.video}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {uploadProgress.image > 0 && uploadProgress.image < 100 && (
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs text-gray-700 mb-1">
                                        <span>Uploading image...</span>
                                        <span>{uploadProgress.image}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                                            style={{ width: `${uploadProgress.image}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}

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
                                    (formData.videoUrl || formData.videoFile)                                ) {
                                    handleStepChange(1);
                                }
                            }}
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
                                    className={`w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                    disabled={isDisabled}
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
                                    Choose a clear and recognizable title to help identify your campaign.
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
                                    What is your call to action (CTA)? Add your website or product link.
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
                                        className={`w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                        disabled={isDisabled}
                                    />
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-[16px] text-green-600 select-all truncate overflow-hidden whitespace-nowrap max-w-[250px]">
                                        {formData.websiteLink || "https://www.example.com"}
                                    </p>

                                    {formData.websiteLink && !isDisabled && (
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
                                    Upload your campaign video (max 100MB, max 30 seconds).
                                    For best results, we recommend using vertical videos.
                                </span>
                            </div>

                            <div className="flex-1">
                                {formData.videoFile ? (
                                    <>
                                        <div 
                                            className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md cursor-pointer"
                                            onClick={() => setPreviewItem({
                                                type: 'video',
                                                url: URL.createObjectURL(formData.videoFile),
                                                name: formData.videoFile.name,
                                                size: formData.videoFile.size
                                            })}
                                        >
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

                                            {!isDisabled && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInputChange({
                                                            target: {
                                                                name: "videoFile",
                                                                value: null
                                                            }
                                                        });
                                                    }}
                                                    className="text-red-500 ml-auto"
                                                >
                                                    <Trash />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : formData.videoUrl ? (
                                    <>
                                        <div 
                                            className="flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md cursor-pointer"
                                            onClick={() => setPreviewItem({
                                                type: 'video',
                                                url: formData.videoUrl,
                                                name: 'Existing Video'
                                            })}
                                        >
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10 flex items-center justify-center">
                                                <Video className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    Existing Video
                                                </span>
                                                <span className="text-xs text-blue-500">
                                                    Click to preview
                                                </span>
                                            </div>
                                            {!isDisabled && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                            )}
                                        </div>
                                        {!isDisabled && (
                                            <div className="mt-4 border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                                <label className="cursor-pointer">
                                                    <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                                                    <p className="text-sm text-gray-700 mb-1">
                                                        Upload new video
                                                    </p>
                                                    <p className="text-xs text-gray-500">Format: mp4, mov</p>
                                                    <input
                                                        type="file"
                                                        accept="video/mp4,video/quicktime"
                                                        onChange={(e) => handleFileChange(e, "video")}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                    </>
                                ) : !isDisabled ? (
                                    <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                        <label className="cursor-pointer">
                                            <Upload className="mx-auto mb-2 text-gray-500 w-6 h-6" />
                                            <p className="text-sm text-gray-700 mb-1">
                                                Upload video
                                            </p>
                                            <p className="text-xs text-gray-500">Format: mp4, mov</p>
                                            <input
                                                type="file"
                                                accept="video/mp4,video/quicktime"
                                                onChange={(e) => handleFileChange(e, "video")}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                        <p className="text-sm text-gray-700 mb-1">
                                            Video upload disabled for active/paused campaigns
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />
                        <div className="flex items-start gap-6">
                            <div className="w-1/3">
                                <label className="block text-[18px] text-gray-800 font-medium">
                                    Brand Logo
                                </label>
                                <span className="block text-[16px] text-gray-400 mt-1">
                                    This logo will be used as a company logo for your campaign (max 10MB).
                                </span>
                            </div>

                            <div className="flex-1">
                                {formData.imageFile ? (
                                    <>
                                        <div 
                                            className="mt-4 flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md cursor-pointer"
                                            onClick={() => setPreviewItem({
                                                type: 'image',
                                                url: URL.createObjectURL(formData.imageFile),
                                                name: formData.imageFile.name,
                                                size: formData.imageFile.size
                                            })}
                                        >
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

                                            {!isDisabled && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleInputChange({
                                                            target: {
                                                                name: "imageFile",
                                                                value: null
                                                            }
                                                        });
                                                    }}
                                                    className="text-red-500 ml-auto"
                                                >
                                                    <Trash />
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : formData.imageUrl ? (
                                    <>
                                        <div 
                                            className="flex items-center gap-4 border bg-white text-blue-700 px-4 py-2 rounded-md cursor-pointer"
                                            onClick={() => setPreviewItem({
                                                type: 'image',
                                                url: formData.imageUrl,
                                                name: 'Existing Image'
                                            })}
                                        >
                                            <div className="bg-blue-50 p-[10px] rounded-full w-10 h-10">
                                                <Image className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm">
                                                    Existing Image
                                                </span>
                                                <span className="text-xs text-blue-500">
                                                    Click to preview
                                                </span>
                                            </div>
                                            {!isDisabled && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                            )}
                                        </div>
                                        {!isDisabled && (
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
                                        )}
                                    </>
                                ) : !isDisabled ? (
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
                                ) : (
                                    <div className="border bg-[var(--bg-color-off-white)] rounded-lg p-6 text-center">
                                        <p className="text-sm text-gray-700 mb-1">
                                            Image upload disabled for active/paused campaigns
                                        </p>
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