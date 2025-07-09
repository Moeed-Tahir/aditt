import Link from 'next/link'
import React from 'react'
import Sliders from '../Sliders'
import { DualRangeSlider } from '../DualSlider'

const Step2 = ({ setFormData, formData,handleStepChange }) => {

    const handleAgeRangeChange = (newRange) => {
        setFormData(prev => ({
            ...prev,
            ageRange: newRange
        }));
    };

    return (
        <>
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

                        <button
                            onClick={() => handleStepChange(2)}
                            className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                        >
                            Next
                        </button>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    <div className="space-y-6">
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
                                    defaultValue={formData.genderRatio || 50}
                                    selectedRadio={formData.genderType}
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

                        <div className="flex items-start gap-6">
                            <div className="w-1/3">
                                <label className="block text-[18px] text-gray-800 font-medium">
                                    Age Range
                                </label>
                                <span className="block text-[16px] text-gray-400 mt-1">
                                    Select the age range of your target audience.
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="relative flex-1 space-y-4">
                                    <DualRangeSlider
                                        min={0}
                                        max={100}
                                        value={formData.ageRange || [18, 65]}
                                        onValueChange={handleAgeRangeChange}
                                        label={(value) => `${value}`}
                                        labelPosition="top"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>18 yrs</span>
                                        <span>65 yrs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step2