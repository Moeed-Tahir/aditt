import Link from 'next/link'
import React from 'react'
import QuestionManager from "../QuestionBox"

const Step3 = ({ formData, setFormData }) => {
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

    return (
        <>
            <div className="min-h-screen px-2 md:px-4 py-4 md:py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4">
                        <div className="w-full md:w-1/3">
                            <label className="block text-lg md:text-[24px] font-medium">
                                Set Questions
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                                Add a quiz or survey for campaign insights.
                            </span>
                        </div>
                        <Link
                            href={isQuizQuestionFilled ? "?step=3" : "#"}
                            className={`w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full ${isQuizQuestionFilled
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-blue-600 opacity-50 cursor-not-allowed'
                                }`}
                            aria-disabled={!isQuizQuestionFilled}
                            tabIndex={!isQuizQuestionFilled ? -1 : undefined}
                            onClick={(e) => {
                                if (!isQuizQuestionFilled) {
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
                                    This is a space for you to gather customizable feedback                                </span>
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
                </div>
            </div>
        </>
    )
}

export default Step3