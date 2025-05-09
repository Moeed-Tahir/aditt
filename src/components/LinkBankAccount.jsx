"use client";
import { Landmark } from "lucide-react";
import Image from "next/image";

export default function LinkBankAccount({ value, onChange }) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {!value?.bankAdded && (
        <div
          onClick={() => onChange({ ...value, isBankFormOpen: true })}
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
        <div className="bg-white border rounded-xl shadow p-6 space-y-4">
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
            <input
              type="text"
              placeholder="Account Type"
              className="w-1/2 p-3 text-sm border rounded-xl"
              value={value.accountType || ""}
              onChange={(e) => onChange({ ...value, accountType: e.target.value })}
            />
          </div>

          <button
            onClick={() => onChange({ ...value, bankAdded: true, isBankFormOpen: false })}
            className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      )}

      {value?.bankAdded && !value.isBankFormOpen && (
        <div
          onClick={() => onChange({ ...value, isBankFormOpen: true })}
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
              <div className="font-semibold text-gray-800">
                Bank Account
              </div>
              <div className="text-sm text-gray-500">
                **** {value.bankAccountNumber?.slice(-4)}
              </div>
            </div>
          </div>
          <div className="text-xl text-gray-400">⋮</div>
        </div>
      )}
    </div>
  );
}