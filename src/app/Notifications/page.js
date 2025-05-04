"use client";
import { Notifications } from "@/components/Notifications";

export default function AnalyticsDashboard() {
  return (
    <>
      <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
        <Notifications />
      </main>
    </>
  );
}
