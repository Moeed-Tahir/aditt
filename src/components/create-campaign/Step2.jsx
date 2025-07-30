import React from "react";
import Sliders from "../Sliders";
import { DualRangeSlider } from "../DualSlider";
import Link from "next/link";

const Step2 = ({ formData, setFormData, values, setValues, isUploading, uploadProgress }) => {
  const handleAgeRangeChange = (newValues) => {
    setValues(newValues);
    setFormData((prev) => ({
      ...prev,
      ageRange: newValues.map(Number),
    }));
  };

  const showProgressSection = (uploadProgress.video > 0 || uploadProgress.image > 0);

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
              Targeting Details
            </label>
            <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
              Reach the right people by setting up precise targeting for your
              ads.
            </span>
          </div>
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
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
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

        <div className="mt-8 flex justify-end">
          <Link
            href="?step=2"
            className="bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Step2;