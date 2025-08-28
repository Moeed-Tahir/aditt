"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Calendars from '../Calendars';
import { CircleDollarSign, Tag } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

let stripePromise;

const getStripe = () => {
    if (!stripePromise) {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!key) {
            console.error('Stripe publishable key is missing!');
            throw new Error('Stripe publishable key is not configured');
        }

        if (!key.startsWith('pk_test_') && !key.startsWith('pk_live_')) {
            throw new Error('Invalid Stripe key format');
        }

        stripePromise = loadStripe(key.trim());
    }
    return stripePromise;
};

const StripePaymentForm = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('Creating payment method...');
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (stripeError) {
                console.error('Stripe error details:', stripeError);
                throw new Error(stripeError.message);
            }

            console.log('Payment method created:', paymentMethod);

            const response = await fetch('/api/routes/v1/campaignRoutes?action=verifyCardDetail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Payment verification failed');
            }


            onSuccess({
                paymentMethodId: data.paymentMethodId,
                cardDetails: {
                    brand: data.cardDetails.brand,
                    last4: data.cardDetails.last4,
                    exp_month: data.cardDetails.exp_month,
                    exp_year: data.cardDetails.exp_year
                },
                fingerprint: data.fingerprint,
                customerId: data.customerId
            });

        } catch (err) {
            setError(err.message);
            onError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border rounded-lg p-3 bg-white">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors ${(!stripe || loading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Processing...' : 'Add Payment Method'}
            </button>
        </form>
    );
};

const Step4 = ({ formData, handleSubmit, setFormData, handleInputChange, isUploading,
    uploadProgress, }) => {

    const [isApplying, setIsApplying] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountInfo, setDiscountInfo] = useState({
        type: null,
        value: 0,
        originalBudget: 0,
        fullWavier: false
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

    const calculateWaiverUsers = useCallback(() => {
        if (!discountInfo.fullWavier || !formData.videoDuration) return 0;

        const [minutes, seconds] = formData.videoDuration.split(':').map(Number);
        const totalSeconds = (minutes * 60) + seconds;

        if (isNaN(totalSeconds) || isNaN(discountInfo.value)) return 0;

        return Math.floor(totalSeconds * discountInfo.value);
    }, [discountInfo.fullWavier, discountInfo.value, formData.videoDuration]);

    const calculateAndSetEngagement = useCallback(() => {
        if (!formData.videoDuration) return;

        let engagementValue = 0;

        if (discountInfo.fullWavier) {
            engagementValue = calculateWaiverUsers();
        } else if (formData.budget) {
            engagementValue = formData.campignBudget || 0;
        }

        setFormData(prev => {
            if (prev.totalEngagementValue === engagementValue) return prev;
            return {
                ...prev,
                totalEngagementValue: engagementValue
            };
        });
    }, [formData.videoDuration, formData.budget, formData.campignBudget, discountInfo.fullWavier, calculateWaiverUsers, setFormData]);

    useEffect(() => {
        calculateAndSetEngagement();
    }, [calculateAndSetEngagement]);

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
                const discountValue = parseFloat(response.data.discountValue);
                const discountType = normalizeDiscountType(response.data.discountType);
                const fullWavier = response.data.fullWavier === true;

                if (isNaN(discountValue)) {
                    throw new Error('Invalid discount value');
                }

                let discountedBudget = originalBudget;
                let campaignBudgetValue = formData.campignBudget || 0;

                if (fullWavier) {
                    discountedBudget = 0;
                    campaignBudgetValue = discountValue; 
                } else if (discountType === 'percentage') {
                    discountValue = Math.min(Math.max(0, discountValue), 100);
                    discountedBudget = originalBudget * (1 - (discountValue / 100));
                } else if (discountType === 'fixedamount') {
                    discountValue = Math.min(Math.max(0, discountValue), originalBudget);
                    discountedBudget = originalBudget - discountValue;
                } else {
                    throw new Error('Unsupported discount type');
                }

                setDiscountInfo({
                    type: discountType.includes('percentage') ? 'percentage' : 'fixed',
                    value: discountValue,
                    originalBudget: originalBudget,
                    fullWavier: fullWavier
                });

                setDiscountApplied(true);

                setFormData(prev => ({
                    ...prev,
                    actualBudget: discountedBudget.toFixed(2),
                    campignBudget: campaignBudgetValue,
                    budget:campaignBudgetValue,
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
            originalBudget: 0,
            fullWavier: false
        });
        setCouponError(null);
        setFormData(prev => ({
            ...prev,
            actualBudget: '',
            campignBudget: 0,
            budget:'',
            couponCode: '',
            appliedCoupon: '',
            totalEngagementValue: ''
        }));
        toast.success('Coupon removed successfully!');
    };

    const isSubmitDisabled = () => {
        if (!formData.startDate) {
            return true;
        }

        if (isUploading && (uploadProgress.video < 100 || uploadProgress.image < 100)) {
            return true;
        }

        if (discountInfo.fullWavier) {
            return false;
        }

        if (!formData.budget) {
            return true;
        }

        const budgetValue = parseFloat(formData.budget);
        if (budgetValue <= 0) {
            return true;
        }

        if (isBudgetZero && discountApplied) {
            return false;
        }

        if (!isBudgetZero && !formData.paymentMethodId) {
            return true;
        }

        return false;
    };

    const showProgressSection = (uploadProgress.video > 0 || uploadProgress.image > 0);

    return (
        <div className="min-h-screen px-2 md:px-4 py-4 md:py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-xl md:rounded-2xl shadow p-4 md:p-8 relative">
                {showProgressSection && (
                    <div className="bg-gray-100 rounded-t-xl md:rounded-t-2xl -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-4 md:mb-6 p-3">
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
                            Campaign budget
                        </label>
                        <span className="block text-sm md:text-[16px] text-gray-500 mt-1">
                            Define your budget to maximize reach and performance.
                        </span>
                    </div>
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
                            <div className="relative">
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
                                {formData.endDate && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                endDate: null,
                                            }));
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-gray-600"
                                        >
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                )}
                            </div>
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
                                    value={discountInfo.fullWavier ? "" : formData.budget}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        calculateAndSetEngagement();
                                    }}
                                    placeholder={discountInfo.fullWavier ? discountInfo.value : "Enter campaign budget"}
                                    className="w-full h-full border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-1 md:py-2"
                                    min="0"
                                    step="0.01"
                                    disabled={discountInfo.fullWavier}
                                />
                            </div>

                            {formData.videoDuration && (
                                <div className="mt-2 text-xs md:text-sm text-gray-500">
                                    {discountInfo.fullWavier ? (
                                        <>
                                            With your {formData.videoDuration}-second video, you will reach approximately {' '}
                                            {calculateWaiverUsers().toLocaleString()} unique users.
                                            <span className="text-green-600 ml-2">
                                                (Full wavier rate: ${discountInfo.value.toFixed(2)} per second)
                                            </span>
                                        </>
                                    ) : formData.budget ? (
                                        <>
                                            With a ${discountApplied ? formData.actualBudget : formData.budget} budget for your{' '}
                                            {formData.videoDuration}-second video, you will reach
                                            approximately {formData.campignBudget} unique users.
                                            {discountApplied && (
                                                <span className="text-green-600 ml-2">
                                                    (Discount applied: {discountInfo.type === 'percentage'
                                                        ? `${discountInfo.value}%`
                                                        : `$${discountInfo.value.toFixed(2)}`})
                                                </span>
                                            )}
                                        </>
                                    ) : null}
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
                                        {discountInfo.fullWavier && " (Full wavier applied)"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <hr className="border-t mb-4 border-gray-300" />

                    {showPaymentSection && !discountInfo.fullWavier && (
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
                                {formData.paymentMethodId ? (
                                    <div className="border rounded-lg p-4 bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">
                                                    {formData.cardDetails.brand} ending in {formData.cardDetails.last4}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Expires {formData.cardDetails.exp_month}/{formData.cardDetails.exp_year}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        paymentMethodId: "",
                                                        card: {
                                                            brand: "",
                                                            last4: "",
                                                            exp_month: "",
                                                            exp_year: ""
                                                        }
                                                    }));
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Elements stripe={getStripe()}>
                                        <StripePaymentForm
                                            onSuccess={(paymentData) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    ...paymentData,
                                                    paymentMethodAdded: true
                                                }));
                                                toast.success('Payment method added successfully');
                                            }}
                                            onError={(error) => {
                                                toast.error(error);
                                            }}
                                        />
                                    </Elements>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled()}
                        className={`bg-blue-600 w-full md:w-[218px] h-12 md:h-[56px] text-sm md:text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step4;