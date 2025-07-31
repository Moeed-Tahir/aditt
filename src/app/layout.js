import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Aditt - Manage Your Campaigns",
  description: "Manage your campaigns effectively with Aditt",
  icons: {
    icon: "/favicon.ico", // Path inside /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg-color)]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
