"use client";
import { Landmark, Check, Trash2, CreditCard } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function LinkBankAccount({ value, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const dropdownRef = useRef(null);

  const toggleBankForm = () => {
    onChange({
      ...value,
      isBankFormOpen: !value.isBankFormOpen
    });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDeleteBank = () => {
    onChange({
      ...value,
      bankAdded: false,
      bankAccountNumber: "",
      routingNumber: "",
      accountType: ""
    });
    setShowDropdown(false);
  };

  const handleMakeDefault = () => {
    setIsDefault(true);
    setShowDropdown(false);
    onChange({
      ...value,
      isDefault: true
    });
  };

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

  return (
    <div className="pt-2 w-full mx-auto relative">
      {!value?.bankAdded && (
        <div
          onClick={toggleBankForm}
          className="bg-[var(--bg-color-off-white)] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
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

      {value?.isBankFormOpen && (
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Account Number"
            value={value.bankAccountNumber || ""}
            onChange={(e) => onChange({ ...value, bankAccountNumber: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Routing Number"
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.routingNumber || ""}
              onChange={(e) => onChange({ ...value, routingNumber: e.target.value })}
            />
            <select
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.accountType || ""}
              onChange={(e) => onChange({ ...value, accountType: e.target.value })}
            >
              <option value="">Select Account Type</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
            </select>
          </div>

          <button
            onClick={() => onChange({ ...value, bankAdded: true, isBankFormOpen: false })}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {value?.bankAdded && (
        <div
          onClick={toggleBankForm}
          className="bg-white border rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mt-2"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/bank-icon.png"
              alt="Bank Account"
              width={40}
              height={24}
            />
            <div>
              <div className="font-semibold text-gray-800 flex items-center">
                Bank Account ({value.accountType?.charAt(0).toUpperCase() + value.accountType?.slice(1)})
                {isDefault && (
                  <span className="ml-2 text-green-500">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                **** {value.bankAccountNumber?.slice(-4)}
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
                    onClick={handleDeleteBank}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
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