"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeLimit, setActiveLimit] = useState(1000);
  const [waitlistLimit, setWaitlistLimit] = useState(500);
  const [editedLimit, setEditedLimit] = useState(1000);
  const [editingTarget, setEditingTarget] = useState("active");
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleSaveLimit = () => {
    if (editingTarget === "active") setActiveLimit(editedLimit);
    else setWaitlistLimit(editedLimit);
    setShowLimitModal(false);
  };

  const activeUsers = [
    {
      _id: "1",
      name: "John Doe",
      image: "User1.png",
      gender: "Male",
      phoneNumber: "+123456789",
      dob: "1990-05-01",
      totalEarning: 1200,
      totalWithdrawal: 800,
    },
    {
      _id: "2",
      name: "Jane Smith",
      image: "User2.png",
      gender: "Female",
      phoneNumber: "+987654321",
      dob: "1985-09-12",
      totalEarning: 1500,
      totalWithdrawal: 900,
    },
  ];

  const waitlistUsers = [
    {
      _id: "3",
      name: "Alice Johnson",
      image: "User2.png",
      gender: "Female",
      phoneNumber: "+1122334455",
      dob: "1992-03-21",
      totalEarning: 0,
      totalWithdrawal: 0,
    },
    {
      _id: "4",
      name: "Bob Williams",
      image: "User1.png",
      gender: "Male",
      phoneNumber: "+9988776655",
      dob: "1988-07-10",
      totalEarning: 0,
      totalWithdrawal: 0,
    },
  ];

  const columns = [
    {
      label: "USER",
      key: "name",
      render: (user) => (
        <div className="flex items-center gap-2">
          <img
            src={`/${user.image}`}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div>{user.name}</div>
            <div className="text-xs text-gray-500">{user.gender}</div>
          </div>
        </div>
      ),
    },
    { label: "PHONE NUMBER", key: "phoneNumber" },
    {
      label: "DOB",
      key: "dob",
      render: (user) => new Date(user.dob).toLocaleDateString("en-GB"),
    },
    {
      label: "TOTAL EARNING",
      key: "totalEarning",
      render: (u) => `$${u.totalEarning}`,
    },
    {
      label: "TOTAL WITHDRAWAL",
      key: "totalWithdrawal",
      render: (u) => `$${u.totalWithdrawal}`,
    },
  ];

  const sortOptions = [
    { label: "A to Z", value: (a, b) => a.name.localeCompare(b.name) },
    { label: "Z to A", value: (a, b) => b.name.localeCompare(a.name) },
  ];

  const dataToShow = activeTab === "active" ? activeUsers : waitlistUsers;

  const headerAction = (
    <div className="flex flex-col gap-4 w-full">
      {/* Tabs */}
      <div className="flex gap-2 rounded bg-gray-100 p-1 text-sm font-semibold w-fit">
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "active"
              ? "bg-blue-600 py-2 px-5 rounded-full text-white"
              : "text-gray-600  py-2 px-5 rounded-full  hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Users
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "waitlist"
              ? "bg-blue-600 py-2 px-5 rounded-full text-white"
              : "text-gray-600  py-2 px-5 rounded-full  hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("waitlist")}
        >
          Waitlist
        </button>
      </div>

      {/* Active tab info */}
      {activeTab === "active" && (
        <div className="bg-white shadow-sm rounded-xl px-6 py-4 w-full flex justify-between items-start flex-wrap gap-4">
          <p className="text-[22px] font-semibold text-gray-800">
            Active Users Limit: {activeLimit}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingTarget("active");
              setEditedLimit(activeLimit);
              setShowLimitModal(true);
            }}
            className="rounded-full py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Limit
          </Button>
        </div>
      )}

      {/* Waitlist tab info */}
      {activeTab === "waitlist" && (
        <div className="bg-white shadow-sm rounded-xl px-6 py-4 w-full flex justify-between items-start flex-wrap gap-4">
          <p className="text-[22px] font-semibold text-gray-800">
            Waitlist Limit: {waitlistLimit}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingTarget("waitlist");
              setEditedLimit(waitlistLimit);
              setShowLimitModal(true);
            }}
            className="rounded-full py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white"

          >
            Edit Limit
          </Button>
        </div>
      )}

      {/* Limit edit modal */}
      <Dialog open={showLimitModal} onOpenChange={setShowLimitModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              Edit {editingTarget === "active" ? "Active Users" : "Waitlist"}{" "}
              Limit
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium">New Limit</label>
            <input
              type="number"
              value={editedLimit}
              onChange={(e) => setEditedLimit(Number(e.target.value))}
              className="w-full border border-input rounded-full px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex justify-between gap-2 w-full">
              <Button
                variant="outline"
                className="rounded-full px-8 py-2 w-1/2"
                onClick={() => setShowLimitModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLimit}
                className="rounded-full px-8 py-2 w-1/2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />
      <GenericTablePage
        title="USERS"
        data={dataToShow}
        columns={columns}
        sortOptions={sortOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        headerAction={headerAction}
        showHeaderAction={true}
      />
    </SidebarProvider>
  );
}
