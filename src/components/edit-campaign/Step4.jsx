import React from "react";
import Calendars from "../Calendars";
import PaymentMethod from "./PaymentMethod";
import LinkBankAccount from "./LinkBankAccount";
import { CircleDollarSign, Tag } from "lucide-react";
const Step4 = ({ handleSubmit, setFormData, formData, handleInputChange, isUploading, uploadProgress }) => {
  const isBudgetZero = parseFloat(formData.budget) === 0;

  return (
    <>
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-8 relative">
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
                Campaign budget
              </label>
              <span className="block text-[16px] text-gray-500 mt-1">
                Define your budget to maximize reach and performance.
              </span>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
            >
              Submit
            </button>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-[18px] text-gray-800 font-medium">
                  Campaign start date (Required)
                </label>
                <span className="block text-[16px] text-gray-400 mt-1">
                  Choose when you want your campaign to go live and start
                  reaching your audience.
                </span>
              </div>
              <div className="relative flex-1">
                <Calendars
                  selected={formData.startDate}
                  onSelect={(date) => {
                    setFormData((prev) => ({
                      ...prev,
                      startDate: date,
                      endDate:
                        prev.endDate && date >= prev.endDate
                          ? null
                          : prev.endDate,
                    }));
                  }}
                  fromDate={new Date()}
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-[18px] text-gray-800 font-medium">
                  Campaign end date (Optional)
                </label>
                <span className="block text-[16px] text-gray-400 mt-1">
                  Choose an end date for your campaign or leave it open-ended to
                  run indefinitely.
                </span>
              </div>

              <div className="relative flex-1">
                <Calendars
                  selected={formData.endDate}
                  onSelect={(date) => {
                    setFormData((prev) => ({
                      ...prev,
                      endDate: date || null,
                    }));
                  }}
                  fromDate={
                    formData.startDate ? formData.startDate : new Date()
                  }
                  isClearable={true}
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-[18px] text-gray-800 font-medium">
                  Calculate campaign budget
                </label>
                <span className="block text-[16px] text-gray-400 mt-1">
                  Define the total budget for your campaign.
                </span>
              </div>

              <div className="relative h-10 md:h-12">
                <CircleDollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter campaign budget"
                  className="w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>
            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-[18px] text-gray-800 font-medium">
                  Coupon Code
                </label>
                <span className="block text-[16px] text-gray-400 mt-1">
                  Add Coupon code If you have.
                </span>
              </div>

              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  placeholder="Enter Coupon Code"
                  className="w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2"
                />
              </div>
            </div>

            <hr className="border-t mb-4 border-gray-300" />

            <div className="flex items-start gap-6">
              <div className="w-1/3">
                <label className="block text-[18px] text-gray-800 font-medium">
                  Payment Info
                </label>
                <span className="block text-[16px] text-gray-400 mt-1">
                  Choose a payment method to fund your campaign.
                </span>
              </div>
              {!isBudgetZero && (
                <div className="relative flex-1">
                  <PaymentMethod
                    value={{
                      cardNumber: formData.cardNumber,
                      monthOnCard: formData.monthOnCard,
                      cvc: formData.cvc,
                      nameOnCard: formData.nameOnCard,
                      country: formData.country,
                      zipCode: formData.zipCode,
                      cardType: formData.cardType,
                      cardAdded: formData.cardAdded,
                      isFormOpen: formData.isFormOpen,
                    }}
                    onChange={(paymentData) =>
                      setFormData((prev) => ({ ...prev, ...paymentData }))
                    }
                  />
                  <LinkBankAccount
                    value={{
                      bankAccountNumber: formData.bankAccountNumber,
                      routingNumber: formData.routingNumber,
                      accountType: formData.accountType,
                      bankAdded: formData.bankAdded,
                      isBankFormOpen: formData.isBankFormOpen,
                    }}
                    onChange={(bankData) =>
                      setFormData((prev) => ({ ...prev, ...bankData }))
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Step4;
