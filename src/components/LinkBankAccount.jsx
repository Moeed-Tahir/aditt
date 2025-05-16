"use client";
import { Landmark, Check, Trash2, CreditCard, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import AlertBox from "./AlertBox";

export default function LinkBankAccount({ value, onChange }) {
  const [showDropdownId, setShowDropdownId] = useState(null);
  const dropdownRef = useRef(null);
  const [bankAccounts, setBankAccounts] = useState(value.bankAccounts || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState({
    bankAccountNumber: "",
    routingNumber: "",
    accountType: "",
    isDefault: false,
  });

  useEffect(() => {
    onChange({ ...value, bankAccounts });
  }, [bankAccounts]);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (isFormOpen) {
      setCurrentBank({
        bankAccountNumber: "",
        routingNumber: "",
        accountType: "",
        isDefault: bankAccounts.length === 0,
      });
    }
  };

  const toggleDropdown = (e, bankId) => {
    e.stopPropagation();
    setShowDropdownId(showDropdownId === bankId ? null : bankId);
  };

  const handleDeleteBank = (bankId) => {
    const newBanks = bankAccounts.filter((_, idx) => idx !== bankId);
    if (bankAccounts[bankId].isDefault && newBanks.length > 0) {
      newBanks[0].isDefault = true;
    }
    setBankAccounts(newBanks);
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

  const handleAddBank = () => {
    if (
      !currentBank.bankAccountNumber ||
      !currentBank.routingNumber ||
      !currentBank.accountType
    ) {
      showAlert("Please fill in all required fields", "error");
      return;
    }
  
    setBankAccounts(prevAccounts => {
      const newBank = {
        ...currentBank,
        isDefault: prevAccounts.length === 0, // Only default if no accounts exist
      };
      return [...prevAccounts, newBank];
    });
  
    showAlert("Bank account added successfully!", "success");
    toggleForm();
  };
  
  const handleMakeDefault = (bankId) => {
    setBankAccounts(prevAccounts => 
      prevAccounts.map((bank, idx) => ({
        ...bank,
        isDefault: idx === bankId, // This will ensure only one bank is default
      }))
    );
    setShowDropdownId(null);
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

  return (
    <div className="pt-2 w-full mx-auto relative">
      {/* Alert Box */}
      {alert.visible && (
        <div className="fixed top-4 right-4 z-50">
          <AlertBox message={alert.message} type={alert.type} />
        </div>
      )}

      {/* Add Bank Button */}
      <div
        onClick={toggleForm}
        className="bg-[var(--bg-color-off-white)] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mb-4"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-800 text-white flex items-center justify-center rounded-full">
            <Landmark className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Link Bank Account</span>
        </div>
        <Plus className="w-5 h-5 text-gray-400" />
      </div>

      {/* Bank Form */}
      {isFormOpen && (
        <div className="w-full space-y-4 mb-4">
          <div className="border p-2  rounded-[12px] w-full">
            <input
              type="text"
              placeholder="Account Number"
              value={currentBank.bankAccountNumber || ""}
              onChange={(e) =>
                setCurrentBank({
                  ...currentBank,
                  bankAccountNumber: e.target.value,
                })
              }
              className=" p-2 focus:outline-none w-full"
            />

            <div className="flex">
              <input
                type="text"
                placeholder="Routing Number"
                className="w-1/2 p-3 focus:outline-none text-sm border-t border-r"
                value={currentBank.routingNumber || ""}
                onChange={(e) =>
                  setCurrentBank({
                    ...currentBank,
                    routingNumber: e.target.value,
                  })
                }
              />
               <input
                type="text"
                placeholder="Select Account Type"
                className="w-1/2 p-3 focus:outline-none text-sm border-t"
                value={currentBank.accountType || ""}
                onChange={(e) =>
                  setCurrentBank({
                    ...currentBank,
                    accountType: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <button
            onClick={handleAddBank}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Add Bank Account
          </button>
        </div>
      )}

      {/* List of Added Bank Accounts */}
      {bankAccounts.map((bank, index) => (
        <div
          key={index}
          className="bg-white border rounded-xl shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 mb-2"
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
                Bank Account (
                {bank.accountType?.charAt(0).toUpperCase() +
                  bank.accountType?.slice(1)}
                )
                {bank.isDefault && (
                  <span className="ml-2 text-green-500">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                **** {bank.bankAccountNumber?.slice(-4)}
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
                    {bank.isDefault && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteBank(index)}
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
      ))}
    </div>
  );
}
