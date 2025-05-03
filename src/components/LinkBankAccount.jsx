"use client";
import { Landmark } from "lucide-react";
import Image from "next/image";

import { useState } from "react";

export default function LinkBankAccount() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [country, setCountry] = useState("United States");
  const [zip, setZip] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cardAdded, setCardAdded] = useState(false);

  const detectCardType = (number) => {
    const sanitized = number.replace(/\s+/g, "");
    if (/^4/.test(sanitized)) return "BankAccount";
    if (
      /^5[1-5]/.test(sanitized) ||
      /^2(2[2-9]|[3-6]|7[01]|720)/.test(sanitized)
    )
      return "BankAccount";
    if (/^3[47]/.test(sanitized)) return "BankAccount";
    return "";
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    setCardType(detectCardType(value));
  };

  const cardLogo = {
    BankAccount: "/bank-icon.png",
    BankAccount: "/bank-icon.png",
    BankAccount: "/bank-icon.png",
  };

  const handleAddCard = () => {
    if (!cardNumber || !expiry || !cvc) return;
    setCardAdded(true);
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto">
        {!isFormOpen && !cardAdded && (
          <div
            onClick={() => setIsFormOpen(true)}
            className="bg-[var(--bg-color-off-white)]  rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-800 text-white flex items-center justify-center rounded-full">
                <span className="text-xl"><Landmark/></span>
              </div>
              <span className="text-sm font-medium">Link Bank Account</span>
            </div>
            <button className="text-2xl text-gray-400">+</button>
          </div>
        )}

        {isFormOpen && (
          <div className="bg-white border rounded-xl shadow p-6 space-y-4">
            <input
              type="text"
              placeholder="Account Number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="border p-2 rounded w-full"
            />

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Routing Number"
                className="w-1/2 p-3 text-sm border rounded-xl"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
              <input
                type="text"
                placeholder="Account Type"
                className="w-1/2 p-3 text-sm border rounded-xl"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>

            <button
              onClick={handleAddCard}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        )}

        {cardAdded && !isFormOpen && (
          <div
            onClick={() => setIsFormOpen(true)}
            className="bg-white border rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mt-2"
          >
            <div className="flex items-center gap-3">
              {cardType && (
                <Image
                  src={cardLogo[cardType]}
                  alt={cardType}
                  width={40}
                  height={24}
                />
              )}
              <div>
                <div className="font-semibold text-gray-800">
                  {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
                </div>
                <div className="text-sm text-gray-500">
                  **** {cardNumber.slice(-4)}
                </div>
              </div>
            </div>
            <div className="text-xl text-gray-400">⋮</div>
          </div>
        )}
      </div>
    </>
  );
}
