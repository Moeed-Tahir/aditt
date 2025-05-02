"use client";
import {
  ChartColumn,
  Megaphone,
  CircleDollarSign,
  Search,
  Settings,
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
    url: "/payment-management",
    icon: CircleDollarSign,
  },
];


export function AppSidebar() {
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
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="text-gray-400">
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-500 hover:font-bold px-5 py-6">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}