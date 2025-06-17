import { UsersTable } from "@/app/admin/users/page";
import Navbar from "../Navbar";

export function AdminDashboard() {
  return (
    <main className="flex h-auto min-h-screen w-full flex-col bg-[var(--bg-color-off-white)]">
      <Navbar />

      <div className="p-4 sm:p-6 lg:p-8">
          <UsersTable minimal /> {/* 👈 Clean embedded use */}
      </div>
    </main>
  );
}
