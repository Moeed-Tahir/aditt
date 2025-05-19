import React from 'react'
import Calendars from '../Calendars';
import { CircleDollarSign, Tag } from 'lucide-react';
import PaymentMethod from '../PaymentMethod';
import LinkBankAccount from '../LinkBankAccount';

const Step4 = ({ formData, handleSubmit, setFormData, handleInputChange }) => {
    return (
        <>
            <div className="min-h-screen px-2 md:px-4 py-4 md:py-8">
                <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 relative">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-8 gap-4">
                        <div className="w-full md:w-1/3">
                            <label className="block text-lg md:text-[24px] font-medium">
                                Campaign budget
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                                Define your budget to maximize reach and performance.
                            </span>
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700"
                        >
                            Submit
                        </button>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Campaign start date (Required)
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Choose when you want your campaign to go live and start
                                    reaching your audience.
                                </span>
                            </div>
                            <div className="relative w-full flex-1">
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
                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Campaign end date (Optional)
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Choose an end date for your campaign or leave it
                                    open-ended to run indefinitely.
                                </span>
                            </div>

                            <div className="relative w-full flex-1">
                                <Calendars
                                    selected={formData.endDate}
                                    onSelect={(date) => {
                                        console.log("Saving end date:", date);
                                        setFormData(prev => ({
                                            ...prev,
                                            endDate: date,
                                        }));
                                    }}
                                    fromDate={formData.startDate || new Date()}
                                />
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />

                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Calculate campaign budget
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Define the total budget for your campaign.
                                </span>
                            </div>

                            <div className="w-full flex-1">
                                <div className="relative w-full h-10 md:h-12">
                                    <CircleDollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        placeholder="Enter campaign budget"
                                        className="w-full h-full border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-1 md:py-2"
                                    />
                                </div>

                                {formData.budget && formData.videoDuration && (
                                    <div className="mt-2 text-xs md:text-sm text-gray-500">
                                        With a ${formData.budget} budget for your{" "}
                                        {formData.videoDuration}-second video, you will reach
                                        approximately {formData.campignBudget} unique users.
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />

                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Coupon Code
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Add Coupon code If you have.
                                </span>
                            </div>

                            <div className="relative w-full flex-1">
                                <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />

                                <input
                                    type="text"
                                    name="couponCode"
                                    value={formData.couponCode}
                                    onChange={handleInputChange}
                                    placeholder="Enter Coupon Code"
                                    className="w-full h-10 md:h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-1 md:py-2"
                                />
                            </div>
                        </div>

                        <hr className="border-t mb-4 border-gray-300" />

                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                            <div className="w-full md:w-1/3">
                                <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                    Payment Info
                                </label>
                                <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                    Choose a payment method to fund your campaign.
                                </span>
                            </div>

                            <div className="relative w-full flex-1">
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Step4