import Link from 'next/link'
import React from 'react'
import QuestionBox from "./QuestionBox";

const Step3 = ({ handleQuestionChange, formData }) => {

    return (
        <>
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
                            className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
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
                                    Adit will create if you dont
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
                                    Adit will NOT create if you dont
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
                                    Adit will NOT create if you dont
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
        </>
    )
}

export default Step3