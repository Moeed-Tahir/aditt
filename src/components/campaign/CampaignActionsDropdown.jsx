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
  Play,
  CheckCheck,
  Trash2,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

export default function CampaignActionsDropdown({ 
  campaignId, 
  openDialog, 
  customTrigger, 
  campaignData, 
  handleAction, 
  fetchCampaign,
  handleDeleteCampaign
}) {
  const userId = Cookies.get("userId");
  const currentStatus = campaignData?.status;

  const updateCampaignStatus = async (status) => {
    try {
      const response = await axios.post('/api/routes/v1/campaignRoutes?action=campaignStatusUpdate', {
        status,
        id: campaignId,
        to: Cookies.get("userEmail")
      });

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to update status');
      }

      toast.success(`Campaign status updated to ${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  };

  const handlePauseUnpause = () => {
    if (currentStatus === 'Paused') {
      openDialog(
        "Are you sure you want to unpause this campaign?",
        "Your campaign will be sent for approval before becoming active.",
        "Unpause",
        async () => {
          try {
            await updateCampaignStatus('Active');
            fetchCampaign();
          } catch (error) {
            console.error("Failed to unpause campaign:", error);
          }
        }
      );
    } else {
      openDialog(
        "Are you sure you want to pause this campaign?",
        "Your campaign won't be visible to users, but you can unpause it anytime.",
        "Pause",
        async () => {
          try {
            await updateCampaignStatus('Paused');
            fetchCampaign();
          } catch (error) {
            console.error("Failed to pause campaign:", error);
          }
        }
      );
    }
  };

  const handleComplete = () => {
    openDialog(
      "Are you sure you want to mark this campaign as completed?",
      "This action cannot be undone.",
      "Complete",
      async () => {
        try {
          await updateCampaignStatus('Completed');
          handleAction("complete", campaignId);
          fetchCampaign();
        } catch (error) {
          console.error("Failed to complete campaign:", error);
        }
      }
    );
  };

  const handleDelete = () => {
    openDialog(
      "Are you sure you want to delete this campaign?",
      "This action cannot be undone.",
      "Delete",
      async () => {
        try {
          await handleDeleteCampaign(campaignId);
          fetchCampaign();
        } catch (error) {
          console.error("Failed to delete campaign:", error);
        }
      }
    );
  };

  const showEdit = ['Active', 'Pending', 'Paused', 'Rejected'].includes(currentStatus);
  const showPauseUnpause = currentStatus === 'Paused' || currentStatus === 'Active';
  const showComplete = currentStatus === 'Paused' || currentStatus === 'Active';
  const showDelete = ['Active', 'Pending', 'Paused', 'Rejected'].includes(currentStatus);

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
        {showEdit && (
          <Link
            href={{
              pathname: `/${userId}/edit-campaign`,
              query: {
                id: campaignId,
                data: JSON.stringify(campaignData)
              }
            }}
            className="w-full"
          >
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </Link>
        )}

        {showPauseUnpause && (
          <DropdownMenuItem onClick={handlePauseUnpause}>
            {currentStatus === 'Paused' ? (
              <>
                <Play className="h-4 w-4 mr-2" />
                Unpause
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            )}
          </DropdownMenuItem>
        )}

        {showComplete && (
          <DropdownMenuItem onClick={handleComplete}>
            <CheckCheck className="h-4 w-4 mr-2 text-green-600" />
            Mark as Completed
          </DropdownMenuItem>
        )}

        {showDelete && (
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}