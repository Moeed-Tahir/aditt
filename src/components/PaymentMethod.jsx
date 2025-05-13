"use client";
import { CreditCard, CreditCardIcon, Check, Trash } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function PaymentMethod({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isDefault, setIsDefault] = useState(false);

  const detectCardType = (number) => {
    const sanitized = number.replace(/\s+/g, "");
    if (/^4/.test(sanitized)) return "visa";
    if (
      /^5[1-5]/.test(sanitized) ||
      /^2(2[2-9]|[3-6]|7[01]|720)/.test(sanitized)
    )
      return "mastercard";
    if (/^3[47]/.test(sanitized)) return "amex";
    return "";
  };

  const handleCardNumberChange = (e) => {
    const cardNumber = e.target.value;
    const cardType = detectCardType(cardNumber);
    onChange({
      ...value,
      cardNumber,
      cardType,
    });
  };

  const toggleForm = () => {
    onChange({
      ...value,
      isFormOpen: !value.isFormOpen,
    });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    setShowDropdown(!showDropdown);
  };

  const handleDeleteCard = () => {
    onChange({
      ...value,
      cardAdded: false,
      cardNumber: "",
      cardType: "",
      monthOnCard: "",
      cvc: "",
      nameOnCard: "",
      country: "United States",
      zipCode: "",
    });
    setShowDropdown(false);
  };

  const handleMakeDefault = () => {
    setIsDefault(true);
    setShowDropdown(false);
    onChange({
      ...value,
      isDefault: true,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cardLogo = {
    visa: "/visa-card.png",
    mastercard: "/master-card.png",
    amex: "/amex-card.png",
  };

  return (
    <div className="pt-2 w-full mx-auto relative">
      {!value?.cardAdded && (
        <div
          onClick={toggleForm}
          className="bg-[var(--bg-color-off-white)] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
              <span className="text-xl">
                <CreditCard />
              </span>
            </div>
            <span className="text-sm font-medium">Add card</span>
          </div>
          <button className="text-2xl text-gray-400">+</button>
        </div>
      )}

      {value?.isFormOpen && (
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Card Number"
            value={value.cardNumber || ""}
            onChange={handleCardNumberChange}
            className="border p-2 rounded w-full"
          />
          {value.cardType && (
            <div className="mt-2">
              <Image
                src={cardLogo[value.cardType]}
                alt={value.cardType}
                width={40}
                height={24}
              />
            </div>
          )}

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="MM / YY"
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.monthOnCard || ""}
              onChange={(e) =>
                onChange({ ...value, monthOnCard: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="CVC"
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.cvc || ""}
              onChange={(e) => onChange({ ...value, cvc: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="Name on card"
            className="w-full p-3 text-sm border rounded-xl"
            value={value.nameOnCard || ""}
            onChange={(e) => onChange({ ...value, nameOnCard: e.target.value })}
          />

          <div className="flex gap-4">
            <select
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.country || "United States"}
              onChange={(e) => onChange({ ...value, country: e.target.value })}
            >
              <option>United States</option>
              <option>Canada</option>
              <option>UK</option>
            </select>
            <input
              type="text"
              placeholder="ZIP"
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.zipCode || ""}
              onChange={(e) => onChange({ ...value, zipCode: e.target.value })}
            />
          </div>

          <button
            onClick={() =>
              onChange({ ...value, cardAdded: true, isFormOpen: false })
            }
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {value?.cardAdded && (
        <div
          onClick={toggleForm}
          className="bg-white border rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mt-2"
        >
          <div className="flex items-center gap-3">
            {value.cardType && (
              <Image
                src={cardLogo[value.cardType]}
                alt={value.cardType}
                width={40}
                height={24}
              />
            )}
            <div>
              <div className="font-semibold text-gray-800 flex items-center">
                {value.cardType?.charAt(0).toUpperCase() +
                  value.cardType?.slice(1)}
                {isDefault && (
                  <span className="ml-2 text-green-500">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                **** {value.cardNumber?.slice(-4)}
              </div>
            </div>
          </div>
          <div
            className="text-xl text-gray-400 relative"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            ⋮
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={handleMakeDefault}
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Set as Default
                    </div>
                    {isDefault && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                  <button
                    onClick={handleDeleteCard}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
