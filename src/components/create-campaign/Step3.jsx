import Link from 'next/link'
import React from 'react'
import QuestionManager from "../QuestionBox"

const Step3 = ({ formData, setFormData, isUploading, uploadProgress }) => {
    const handleQuestionChange = (questionType, updatedQuestion) => {
        setFormData(prev => ({
            ...prev,
            [questionType]: updatedQuestion
        }));
    };

    const isQuizQuestionFilled = formData.quizQuestion &&
        formData.quizQuestion.text &&
        formData.quizQuestion.text.trim() !== '' &&
        formData.quizQuestion.options &&
        formData.quizQuestion.options.length > 0 &&
        formData.quizQuestion.options.every(opt => opt.trim() !== '') &&
        formData.quizQuestion.correctAnswer !== null;

    const showProgressSection = (uploadProgress.video > 0 || uploadProgress.image > 0);
    const isVideoUploadComplete = uploadProgress.video === 100;

    return (
        <div className="min-h-screen px-2 md:px-4 py-4 md:py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 relative">
                {showProgressSection && (
                    <div className="bg-gray-100 rounded-t-xl md:rounded-t-2xl -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-4 md:mb-6 p-3">
                        {/* Video Upload Progress - now shows even if image is complete */}
                        {uploadProgress.video > 0 && (
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-700 mb-1">
                                    <span>
                                        {uploadProgress.video < 100 ? 'Uploading video...' : 'Video upload complete!'}
                                    </span>
                                    <span>{uploadProgress.video}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${uploadProgress.video < 100 ? 'bg-blue-600' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${uploadProgress.video}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Image Upload Progress - now shows even if video is complete */}
                        {uploadProgress.image > 0 && (
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-700 mb-1">
                                    <span>
                                        {uploadProgress.image < 100 ? 'Uploading image...' : 'Image upload complete!'}
                                    </span>
                                    <span>{uploadProgress.image}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${uploadProgress.image < 100 ? 'bg-blue-600' : 'bg-green-500'
                                            }`}
                                        style={{ width: `${uploadProgress.image}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4">
                    <div className="w-full md:w-1/3">
                        <label className="block text-lg md:text-[24px] font-medium">
                            Set Questions
                        </label>
                        <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                            Add a quiz or survey for campaign insights.
                        </span>
                    </div>
                </div>

                <hr className="border-t mb-4 border-gray-300" />

                <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                Quiz Question
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                This question should confirm the viewer paid attention to your video.
                            </span>
                        </div>
                        <div className="relative w-full flex-1">
                            <QuestionManager
                                question={formData.quizQuestion || {
                                    text: "",
                                    options: ["", "", "", ""],
                                    correctAnswer: null,
                                    selectedAnswer: null
                                }}
                                onChange={(updatedQuestion) =>
                                    handleQuestionChange("quizQuestion", updatedQuestion)
                                }
                                isQuiz={true}
                                name="quizQuestion"
                                buttonLabel="+ Add Quiz Question"
                            />
                        </div>
                    </div>
                    <hr className="border-t mb-4 border-gray-300" />
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                Survey Question 1 (optional)
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                This is a space for you to gather customizable feedback
                            </span>
                        </div>
                        <div className="relative w-full flex-1">
                            <QuestionManager
                                question={formData.surveyQuestion1}
                                onChange={(updatedQuestion) =>
                                    handleQuestionChange("surveyQuestion1", updatedQuestion)
                                }
                                isQuiz={false}
                                name="surveyQuestion1"
                                buttonLabel="+ Add Survey Question 1"
                            />
                        </div>
                    </div>
                    <hr className="border-t mb-4 border-gray-300" />
                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                Survey Question 2 (optional)
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                This is a space for you to gather customizable feedback
                            </span>
                        </div>
                        <div className="relative w-full flex-1">
                            <QuestionManager
                                question={formData.surveyQuestion2}
                                onChange={(updatedQuestion) =>
                                    handleQuestionChange("surveyQuestion2", updatedQuestion)
                                }
                                isQuiz={false}
                                name="surveyQuestion2"
                                buttonLabel="+ Add Survey Question 2"
                            />
                        </div>
                    </div>
                </div>

                {/* Moved Next button to bottom */}
                <div className="mt-8 flex justify-end">
                    <Link
                        href={isQuizQuestionFilled && isVideoUploadComplete ? "?step=3" : "#"}
                        className={`w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full ${isQuizQuestionFilled && isVideoUploadComplete
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-blue-600 opacity-50 cursor-not-allowed'
                            }`}
                        aria-disabled={!(isQuizQuestionFilled && isVideoUploadComplete)}
                        tabIndex={!(isQuizQuestionFilled && isVideoUploadComplete) ? -1 : undefined}
                        onClick={(e) => {
                            if (!isQuizQuestionFilled || !isVideoUploadComplete) {
                                e.preventDefault();
                            }
                        }}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Step3