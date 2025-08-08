"use client";

import {
  ChartColumn,
  Megaphone,
  CircleDollarSign,
  Headset,
  LayoutDashboard,
  Users,
  User2,
  Speaker,
  ChartPie,
  TicketPercent,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Cookies from "js-cookie";

export function AppSidebar({ mode = "user" }) {
  const pathname = usePathname();
  const userId = Cookies.get("userId");

  const campaignItems = [
    {
      title: "Campaign",
      url: `/${userId}/campaign-dashboard`,
      icon: Megaphone,
    },
  ];

  const adminItems = [
    {
      title: "Dashboard",
      url: `/admin/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: `/admin/users`,
      icon: User2,
    },
    {
      title: "Consumer Pending User",
      url: `/admin/consumer-user`,
      icon: User2,
    },
    {
      title: "Advertisers",
      url: `/admin/advertisers`,
      icon: Users,
    },
    {
      title: "Total Campaigns",
      url: `/admin/total-campaigns`,
      icon: Megaphone,
    },
    {
      title: "Ads for Approval",
      url: `/admin/ads-approval`,
      icon: ChartPie,
    },
    {
      title: "Promo Codes",
      url: `/admin/promo-codes`,
      icon: TicketPercent,
    },
    {
      title: "Account Delete Requests",
      url: `/admin/account-delete-requests`,
      icon: Trash2,
    },
  ];

  const items = mode === "admin" ? adminItems : campaignItems;

  return (
    <Sidebar className="min-h-screen">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="py-10">
            <Image
              src="/Aditt logo.jpg"
              alt="logo"
              width={100}
              height={100}
              className="mb-5 py-6"
            />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={clsx(
                        "px-5 py-6 flex gap-3 items-center",
                        isActive
                          ? "bg-blue-50 text-blue-600 font-bold rounded-full"
                          : "text-gray-400 hover:bg-blue-50 hover:text-blue-500 hover:font-bold"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sticky Help Box */}
        {mode === "user" && (
          <div className="mt-auto p-4">
            <div className="bg-blue-100 text-sm p-4 rounded-xl shadow-md">
              <Headset className="text-blue-500 mb-4 w-10 h-10" />
              <p className="font-semibold text-xl mb-2">Need help?</p>
              <p className="text-xs text-gray-600 mb-2">
                Get answers, resolve issues, or reach out to our support team.
              </p>
              <Link
                href={`/${userId}/support`}
                className="block w-full text-center bg-white text-blue-600 rounded-full py-2 text-xl hover:bg-blue-700 hover:text-white transition"
              >
                Contact us
              </Link>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
