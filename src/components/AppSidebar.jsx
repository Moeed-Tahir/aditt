"use client";
import {
  ChartColumn,
  Megaphone,
  CircleDollarSign,
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
import clsx from "clsx"; // Make sure to install clsx if not already: `npm install clsx`

const items = [
  {
    title: "Campaign",
    url: "/CampaignDashboard",
    icon: Megaphone,
  },
  {
    title: "Analytics",
    url: "/Analytics",
    icon: ChartColumn,
  },
  {
    title: "Payment Management",
    url: "/PaymentManagement",
    icon: CircleDollarSign,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
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
                          ? "bg-blue-50 text-blue-600 font-bold"
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
      </SidebarContent>
    </Sidebar>
  );
}
