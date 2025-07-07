import React from "react";
import Sliders from "../Sliders";
import { DualRangeSlider } from "../DualSlider";
import Link from "next/link";

const Step2 = ({ formData, setFormData, values, setValues, isUploading,
  uploadProgress, }) => {
  const handleAgeRangeChange = (newValues) => {
    setValues(newValues);
    setFormData((prev) => ({
      ...prev,
      ageRange: newValues.map(Number),
    }));
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
                Targeting Details
              </label>
              <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                Reach the right people by setting up precise targeting for your
                ads.
              </span>
            </div>

            <Link
              href="?step=2"
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
                  Gender Ratio
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  Define your preferred male-to-female ratio for ad targeting.
                </span>
              </div>
              <div className="relative bg-blue w-full flex-1">
                <Sliders
                  min={0}
                  max={100}
                  defaultValue={formData.genderRatio}
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
                  selectedRadio={formData.genderType}
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="w-full md:w-1/3">
                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                  Age
                </label>
                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                  Select the age range of your target audience.
                </span>
              </div>

              <div className="w-full flex-1">
                <div className="relative w-full flex-1">
                  <DualRangeSlider
                    label={(value) => value}
                    labelPosition="bottom"
                    value={values}
                    onValueChange={handleAgeRangeChange}
                    min={13}
                    max={65}
                    step={1}
                  />
                  <div className="flex justify-between text-xs md:text-sm mt-2.5">
                    {/* <span>13</span>
                    <span>65 +</span> */}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step2;
