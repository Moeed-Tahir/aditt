"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  Pencil,
  Pause,
  CheckCheck,
} from "lucide-react";

export default function CampaignActionsDropdown({ 
  campaignId, 
  openDialog, 
  customTrigger,
  onCompleteConfirm 
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="h-4 text-gray-400 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/edit-campaign/id`} className="w-full">
          <DropdownMenuItem>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem
          onClick={() =>
            openDialog(
              "Are you sure you want to pause this campaign?",
              "Your campaign won't be visible to users, but you can resume it anytime.",
              "Pause",
              () => {
                console.log("Paused", campaignId);
              }
            )
          }
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            openDialog(
              "Are you sure you want to mark this campaign as completed?",
              "This action cannot be undone.",
              "Completed",
              () => {
                console.log("Marked as completed", campaignId);
                onCompleteConfirm(); // This will trigger the feedback dialog
              }
            )
          }
        >
          <CheckCheck className="h-4 w-4 mr-2 text-green-600" />
          Mark as Completed
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}