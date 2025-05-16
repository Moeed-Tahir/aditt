"use client";

import Navbar2 from "@/components/Navbar2";
import Cookies from "js-cookie";
import InternalHeader from "@/components/InternalHeader";
import FAQs from "./FAQs";
import PlatformGuidelines from "./PlatformGuidelines";
import ChatWithSupportSection from "./ChatWithSupportSection";
import { useEffect, useState } from "react";

function Support() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = Cookies.get("UserId") || Cookies.get("userId");
    setUserId(id);
  }, []);

  return (
    <main className="flex h-auto min-h-screen w-full flex-col gap-4 bg-[var(--bg-color-off-white)]">
      <Navbar2 userId={userId} />
      <div className="p-4 md:p-10">
        <InternalHeader
          backLink={userId ? `/${userId}/campaign-dashboard` : "/"}
          heading="Help Center"
        />
        <div className="flex flex-col gap-6">
          <FAQs />
          {userId && <ChatWithSupportSection userId={userId} />}
          <PlatformGuidelines />
        </div>
      </div>
    </main>
  );
}

export default Support;
