import Link from 'next/link'
import React from 'react'
import QuestionBox from "../QuestionBox"
const Step3 = ({formData,handleQuestionChange}) => {
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
                            href="?step=3"
                            className="bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                        >
                            Next
                        </Link>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Quiz Question (optional)
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Adit will create if you don't
                                </span>
                            </div>
                            <div className="relative w-full flex-1">
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
                                    Adit will NOT create if you don't
                                </span>
                            </div>
                            <div className="relative w-full flex-1">
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
                                    Adit will NOT create if you don't
                                </span>
                            </div>
                            <div className="relative w-full flex-1">
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