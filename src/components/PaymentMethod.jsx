"use client";
import { CreditCard, CreditCardIcon, Check, Trash, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { allCountries } from "country-telephone-data";
import AlertBox from "./AlertBox";

export default function PaymentMethod({ value, onChange }) {
  const [showDropdownId, setShowDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [cards, setCards] = useState(value.cards || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    cardNumber: "",
    monthOnCard: "",
    cvc: "",
    nameOnCard: "",
    country: "United States",
    zipCode: "",
    cardType: "",
    isDefault: false,
  });

  useEffect(() => {
    onChange({ ...value, cards });
  }, [cards]);

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
    setCurrentCard({
      ...currentCard,
      cardNumber,
      cardType,
    });
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (isFormOpen) {
      setCurrentCard({
        cardNumber: "",
        monthOnCard: "",
        cvc: "",
        nameOnCard: "",
        country: "United States",
        zipCode: "",
        cardType: "",
        isDefault: cards.length === 0,
      });
    }
  };

  const toggleDropdown = (e, cardId) => {
    e.stopPropagation();
    setShowDropdownId(showDropdownId === cardId ? null : cardId);
  };

  const handleDeleteCard = (cardId) => {
    const newCards = cards.filter((_, idx) => idx !== cardId);
    if (cards[cardId].isDefault && newCards.length > 0) {
      newCards[0].isDefault = true;
    }
    setCards(newCards);
    setShowDropdownId(null);
  };

  const handleMakeDefault = (cardId) => {
    setCards(
      cards.map((card, idx) => ({
        ...card,
        isDefault: idx === cardId,
      }))
    );
    setShowDropdownId(null);
  };

  const [alert, setAlert] = useState({
    message: "",
    type: "", // 'success' | 'error' | 'info' | 'warning'
    visible: false,
  });

  const showAlert = (message, type) => {
    setAlert({
      message,
      type,
      visible: true,
    });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleAddCard = () => {
    // Check if any required field is empty
    if (
      !currentCard.cardNumber ||
      !currentCard.monthOnCard ||
      !currentCard.cvc ||
      !currentCard.nameOnCard ||
      !currentCard.zipCode
    ) {
      showAlert("Please fill in all required fields", "error");
      return;
    }

    const newCard = {
      ...currentCard,
      isDefault: cards.length === 0,
    };
    setCards([...cards, newCard]);
    showAlert("Card added successfully!", "success");
    toggleForm();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownId(null);
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
      {/* Alert Box */}
      {alert.visible && (
        <div className="fixed top-4 right-4 z-50">
          <AlertBox message={alert.message} type={alert.type} />
        </div>
      )}

      {/* Add Card Button */}
      <div
        onClick={toggleForm}
        className="bg-[var(--bg-color-off-white)] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 text-white flex items-center justify-center rounded-full">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Add card</span>
        </div>
        <Plus className="w-5 h-5 text-gray-400" />
      </div>

      {/* Card Form */}
      {isFormOpen && (
        <div className="w-full space-y-4 mb-4">
          <div className="border p-2 rounded-[12px] w-full">
            <input
              type="text"
              placeholder="Card Number"
              value={currentCard.cardNumber || ""}
              onChange={handleCardNumberChange}
              className=" p-2 w-full focus:outline-none"
            />
            {currentCard.cardType && (
              <div className="mt-2">
                <Image
                  src={cardLogo[currentCard.cardType]}
                  alt={currentCard.cardType}
                  width={40}
                  height={24}
                />
              </div>
            )}

            <div className="flex">
              <input
                type="text"
                placeholder="MM / YY"
                className="w-1/2 p-3 text-sm focus:outline-none border-t border-r"
                value={currentCard.monthOnCard || ""}
                onChange={(e) =>
                  setCurrentCard({
                    ...currentCard,
                    monthOnCard: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 p-3 focus:outline-none text-sm border-t"
                value={currentCard.cvc || ""}
                onChange={(e) =>
                  setCurrentCard({ ...currentCard, cvc: e.target.value })
                }
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Name on card"
            className="w-full p-3 focus:outline-none text-sm border rounded-xl"
            value={currentCard.nameOnCard || ""}
            onChange={(e) =>
              setCurrentCard({ ...currentCard, nameOnCard: e.target.value })
            }
          />
          <div className="border p-2 rounded-[12px] w-full">
            <div className="flex">
              <select
                className="w-full p-3 focus:outline-none text-sm"
                value={currentCard.country || "United States"}
                onChange={(e) =>
                  setCurrentCard({ ...currentCard, country: e.target.value })
                }
              >
                {allCountries.map((country) => {
                  const flagEmoji = country.iso2
                    .toUpperCase()
                    .replace(/./g, (char) =>
                      String.fromCodePoint(127397 + char.charCodeAt(0))
                    );
                  return (
                    <option key={country.iso2} value={country.name}>
                      {flagEmoji} {country.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="ZIP"
                className="w-full focus:outline-none p-3 text-sm border-t"
                value={currentCard.zipCode || ""}
                onChange={(e) =>
                  setCurrentCard({ ...currentCard, zipCode: e.target.value })
                }
              />
            </div>
          </div>

          <button
            onClick={handleAddCard}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Add Card
          </button>
        </div>
      )}

      {/* List of Added Cards */}
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white border rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mb-2"
        >
          <div className="flex items-center gap-3">
            {card.cardType && (
              <Image
                src={cardLogo[card.cardType]}
                alt={card.cardType}
                width={40}
                height={24}
              />
            )}
            <div>
              <div className="font-semibold text-gray-800 flex items-center">
                {card.cardType?.charAt(0).toUpperCase() +
                  card.cardType?.slice(1)}
                {card.isDefault && (
                  <span className="ml-2 text-green-500">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                **** {card.cardNumber?.slice(-4)}
              </div>
            </div>
          </div>
          <div
            className="text-xl text-gray-400 relative"
            onClick={(e) => toggleDropdown(e, index)}
            ref={dropdownRef}
          >
            ⋮
            {showDropdownId === index && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => handleMakeDefault(index)}
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Set as Default
                    </div>
                    {card.isDefault && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteCard(index)}
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
      ))}
    </div>
  );
}
