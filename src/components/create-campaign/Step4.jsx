"use client";

import React, { useState, useEffect } from 'react';
import Calendars from '../Calendars';
import { CircleDollarSign, Tag } from 'lucide-react';
import PaymentMethod from '../PaymentMethod';
import LinkBankAccount from '../LinkBankAccount';
import axios from 'axios';
import { toast } from 'sonner';

const Step4 = ({ formData, handleSubmit, setFormData, handleInputChange }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountInfo, setDiscountInfo] = useState({
        type: null,
        value: 0,
        originalBudget: 0
    });
    const [couponError, setCouponError] = useState(null);
    const [showPaymentSection, setShowPaymentSection] = useState(true);

    const currentBudget = parseFloat(formData.actualBudget || formData.budget || 0);
    const isBudgetZero = currentBudget === 0;

    useEffect(() => {
        setShowPaymentSection(!(isBudgetZero && discountApplied));
    }, [isBudgetZero, discountApplied]);

    const normalizeDiscountType = (type) => {
        if (!type) return null;
        return type.toLowerCase().replace(/\s+/g, '');
    };

    const handleApplyCoupon = async () => {
        if (!formData.couponCode?.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setIsApplying(true);
        setCouponError(null);

        try {
            const response = await axios.post('/api/routes/v1/promoRoutes?action=applyPromoCode', {
                code: formData.couponCode.trim()
            });

            if (response.data.success) {
                const originalBudget = parseFloat(formData.budget);
                if (isNaN(originalBudget) || originalBudget <= 0) {
                    throw new Error('Please set a valid budget before applying coupon');
                }

                let discountedBudget = originalBudget;
                let discountValue = parseFloat(response.data.discountValue);
                const discountType = normalizeDiscountType(response.data.discountType);

                if (isNaN(discountValue)) {
                    throw new Error('Invalid discount value');
                }

                if (discountType === 'percentage') {
                    discountValue = Math.min(Math.max(0, discountValue), 100);
                    discountedBudget = originalBudget * (1 - (discountValue / 100));
                } else if (discountType === 'fixedamount') {
                    discountValue = Math.min(Math.max(0, discountValue), originalBudget);
                    discountedBudget = originalBudget - discountValue;
                } else {
                    throw new Error('Unsupported discount type');
                }

                setDiscountApplied(true);
                setDiscountInfo({
                    type: discountType.includes('percentage') ? 'percentage' : 'fixed',
                    value: discountValue,
                    originalBudget: originalBudget
                });

                setFormData(prev => ({
                    ...prev,
                    actualBudget: discountedBudget.toFixed(2),
                    appliedCoupon: formData.couponCode.trim()
                }));

                toast.success('Coupon applied successfully!');
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            const errorMessage = error.response?.data?.error ||
                error.message ||
                'Failed to apply promo code';
            setCouponError(errorMessage);
            setDiscountApplied(false);

            if (error.response?.data?.error?.toLowerCase().includes('invalid') ||
                error.response?.data?.error?.toLowerCase().includes('expired') ||
                error.message.toLowerCase().includes('invalid')) {
                setFormData(prev => ({
                    ...prev,
                    couponCode: ''
                }));
            }
        } finally {
            setIsApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setDiscountApplied(false);
        setDiscountInfo({
            type: null,
            value: 0,
            originalBudget: 0
        });
        setCouponError(null);
        setFormData(prev => ({
            ...prev,
            actualBudget: '',
            couponCode: '',
            appliedCoupon: ''
        }));
        toast.success('Coupon removed successfully!');
    };

    const isSubmitDisabled = () => {
        if (!formData.startDate || !formData.endDate || !formData.budget) {
            return true;
        }

        const budgetValue = parseFloat(formData.budget);
        if (budgetValue <= 0) {
            return true;
        }

        if (isBudgetZero && discountApplied) {
            return false;
        }

        if (!isBudgetZero && formData.cards.length === 0 && formData.bankAccounts.length === 0) {
            return true;
        }

        return false;
    };

    return (
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
                        disabled={isSubmitDisabled()}
                        className={`bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
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
                                Choose when you want your campaign to go live.
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
                                Choose an end date or leave it open-ended.
                            </span>
                        </div>
                        <div className="relative w-full flex-1">
                            <Calendars
                                selected={formData.endDate}
                                onSelect={(date) => {
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
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* {formData.budget && formData.videoDuration && (
                                <div className="mt-2 text-xs md:text-sm text-gray-500">
                                    With a ${discountApplied ? formData.actualBudget : formData.budget} budget for your{" "}
                                    {formData.videoDuration}-second video, you will reach
                                    approximately {formData.campignBudget} unique users.
                                    {discountApplied && (
                                        <span className="text-green-600 ml-2">
                                            (Discount applied: {discountInfo.type === 'percentage'
                                                ? `${discountInfo.value}%`
                                                : `$${discountInfo.value.toFixed(2)}`})
                                        </span>
                                    )}
                                </div>
                            )} */}
                        </div>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                        <div className="w-full md:w-1/3">
                            <label className="block text-base md:text-[18px] text-gray-800 font-medium">
                                Coupon Code
                            </label>
                            <span className="block text-sm md:text-[16px] text-gray-400 mt-1">
                                Add Coupon code if you have one.
                            </span>
                        </div>
                        <div className="relative w-full flex-1">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center relative">
                                    <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        name="couponCode"
                                        value={formData.couponCode}
                                        onChange={handleInputChange}
                                        placeholder="Enter Coupon Code"
                                        className="w-full h-10 md:h-12 border border-gray-300 text-gray-600 rounded-l-full pl-10 pr-4 py-1 md:py-2"
                                        disabled={discountApplied}
                                    />
                                    {discountApplied ? (
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="h-10 md:h-12 px-4 md:px-6 bg-red-500 text-white rounded-r-full hover:bg-red-600 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplying || !formData.couponCode}
                                            className={`h-10 md:h-12 px-4 md:px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors ${isApplying ? 'opacity-70 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            {isApplying ? 'Applying...' : 'Apply'}
                                        </button>
                                    )}
                                </div>
                                {couponError && (
                                    <div className="text-xs md:text-sm text-red-500">
                                        {couponError}
                                    </div>
                                )}
                                {discountApplied && (
                                    <div className="text-xs md:text-sm text-green-600">
                                        Coupon code applied successfully!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    {showPaymentSection && (
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4;