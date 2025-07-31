"use client";

import React from "react";
import Calendars from "../Calendars";
import { CircleDollarSign, Tag } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from "sonner";

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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

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
        paymentMethodId: paymentMethod.id,
        cardDetails: {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        },
        fingerprint: paymentMethod.card.fingerprint,
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
        className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors ${(!stripe || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : 'Add Payment Method'}
      </button>
    </form>
  );
};

const Step4 = ({ handleSubmit, setFormData, formData, handleInputChange, isUploading, uploadProgress }) => {
  const isBudgetZero = parseFloat(formData.budget) === 0;
  const isDisabled = formData.status === "Active" || formData.status === "Paused";

  const handlePaymentSuccess = (paymentData) => {
    setFormData(prev => ({
      ...prev,
      cardDetail: {
        paymentMethodId: paymentData.paymentMethodId,
        cardDetails: {
          brand: paymentData.cardDetails.brand,
          last4: paymentData.cardDetails.last4,
          exp_month: paymentData.cardDetails.exp_month,
          exp_year: paymentData.cardDetails.exp_year
        },
        fingerprint: paymentData.fingerprint
      },
      cardAdded: true
    }));
    toast.success('Payment method added successfully');
  };

  const handlePaymentError = (error) => {
    toast.error(error);
  };

  const handleRemoveCard = () => {
    setFormData(prev => ({
      ...prev,
      cardDetail: null,
      cardAdded: false
    }));
  };

  return (
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
            disabled={isUploading || isBudgetZero || !formData.cardDetail}
            className={`bg-blue-600 w-[218px] h-[56px] text-[16px] font-md text-white flex justify-center items-center rounded-full hover:bg-blue-700 ${
              isUploading || isBudgetZero || !formData.cardDetail ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Processing...' : 'Submit'}
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
                Choose when you want your campaign to go live.
              </span>
            </div>
            <div className="relative flex-1">
              <Calendars
                selected={formData.startDate}
                onSelect={!isDisabled ? (date) => {
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date,
                    endDate:
                      prev.endDate && date >= prev.endDate
                        ? null
                        : prev.endDate,
                  }));
                } : undefined}
                fromDate={new Date()}
                disabled={isDisabled}
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
                Choose an end date or leave it open-ended.
              </span>
            </div>

            <div className="relative flex-1">
              <Calendars
                selected={formData.endDate}
                onSelect={!isDisabled ? (date) => {
                  setFormData((prev) => ({
                    ...prev,
                    endDate: date || null,
                  }));
                } : undefined}
                fromDate={
                  formData.startDate ? formData.startDate : new Date()
                }
                isClearable={true}
                disabled={isDisabled}
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

            <div className="w-full flex-1">
              <div className="relative w-full h-10 md:h-12">
                <CircleDollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter campaign budget"
                  className={`w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2 ${
                    isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={isDisabled}
                />
              </div>
            </div>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-[18px] text-gray-800 font-medium">
                Coupon Code
              </label>
              <span className="block text-[16px] text-gray-400 mt-1">
                Add Coupon code if you have one.
              </span>
            </div>

            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                name="couponCode"
                value={formData.couponCode}
                onChange={!isDisabled ? handleInputChange : undefined}
                placeholder="Enter Coupon Code"
                className={`w-full h-12 border border-gray-300 text-gray-600 rounded-full pl-10 pr-4 py-2 ${
                  isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isDisabled}
              />
            </div>
          </div>

          <hr className="border-t mb-4 border-gray-300" />

          <div className="flex items-start gap-6">
            <div className="w-1/3">
              <label className="block text-[18px] text-gray-800 font-medium">
                Payment Method
              </label>
              <span className="block text-[16px] text-gray-400 mt-1">
                Add a payment method to fund your campaign.
              </span>
            </div>

            <div className="relative w-full flex-1">
              {formData.cardDetail?.paymentMethodId ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {formData.cardDetail.cardDetails.brand} ending in {formData.cardDetail.cardDetails.last4}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires {formData.cardDetail.cardDetails.exp_month}/{formData.cardDetail.cardDetails.exp_year}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCard}
                      className="text-red-500 hover:text-red-700"
                      disabled={isDisabled}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <Elements stripe={getStripe()}>
                  <StripePaymentForm
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;