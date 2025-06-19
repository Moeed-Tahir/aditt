"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GenericTablePage } from "@/components/admin/GenericTablePage";
import { EllipsisVertical, Plus, Pencil, Pause, Trash } from "lucide-react";
import PromoCodeDialog from "@/components/PromoCodeDialog";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditPromoCodeDialog from "@/components/EditPromoCode";

export default function PromoCodes() {
  const [promoData, setPromoData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPromo, setCurrentPromo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPromoData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/routes/v1/promoRoutes?action=getAllPromoCodes");
      
      if (response.data.message === "Successfully Get Promo Codes") {
        setPromoData(response.data.promoCodes);
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Failed to fetch promo codes");
    } finally {
      setLoading(false);
    }
  };

  

  const togglePromoStatus = async (id) => {
    try {
      const response = await axios.post("/api/routes/v1/promoRoutes?action=togglePromoCodeStatus", { id });
      console.log("response",response);

      if (response.data) {
        setPromoData(prevData => 
          prevData.map(promo => 
            promo._id === id ? { ...promo, status: !promo.status } : promo
          )
        );
        toast.success(`Promo code ${response.data.status ? "activated" : "deactivated"}`);
      }
    } catch (error) {
      console.error("Error toggling promo status:", error);
      toast.error("Failed to update promo status");
    }
  };

  const handleEditClick = (promo) => {
    setCurrentPromo(promo);
    setOpenEdit(true);
  };

  const handleDeletePromo = async (id) => {
    try {
      const response = await axios.post("/api/routes/v1/promoRoutes?action=deletePromoCode", { id });
      
      if (response.data) {
        toast.success("Promo code deleted successfully");
        fetchPromoData();
      }
    } catch (error) {
      console.error("Error deleting promo:", error);
      toast.error("Failed to delete promo code");
    }
  };

  const handleUpdatePromo = async (updatedData) => {
    try {
      const response = await axios.post("/api/routes/v1/promoRoutes?action=updatePromoCode", {
        id: currentPromo._id,
        ...updatedData
      });
      
      if (response.data) {
        toast.success("Promo code updated successfully");
        fetchPromoData();
        setOpenEdit(false);
      }
    } catch (error) {
      console.error("Error updating promo:", error);
      toast.error("Failed to update promo code");
    }
  };

  useEffect(() => {
    fetchPromoData();
  }, []);

  const columns = [
    {
      label: "CODE NAME",
      key: "name",
      render: (promoCodes) => (
        <div className="flex items-center gap-2">
          <div>
            <div>{promoCodes.name}</div>
          </div>
        </div>
      ),
    },
    { 
      label: "DISCOUNT TYPE", 
      key: "discountType" 
    },
    { 
      label: "VALUE", 
      key: "discountValue", 
      render: (u) => `${u.discountType === 'Percentage' ? `${u.discountValue}%` : `$${u.discountValue}`}` 
    },
    {
      label: "STATUS",
      key: "status",
      render: (promoCodes) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={promoCodes.status}
            onChange={() => togglePromoStatus(promoCodes._id)}
          />
          <div className={`w-11 h-6 ${promoCodes.status ? 'bg-blue-600' : 'bg-gray-300'} rounded-full peer-checked:bg-blue-600 transition-colors`}></div>
          <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${promoCodes.status ? 'translate-x-5' : ''}`}></div>
        </label>
      ),
    },
    {
      label: "APPLIES TO",
      key: "appliesTo",
    },
    {
      label: "EXPIRY",
      key: "endDate",
      render: (promoCodes) => new Date(promoCodes.endDate).toLocaleDateString(),
    },
  ];

  const sortOptions = [
    { 
      label: "A to Z", 
      value: (a, b) => {
        if (!a || !b) return 0;
        return (a.name || '').localeCompare(b.name || '')
      } 
    },
    { 
      label: "Z to A", 
      value: (a, b) => {
        if (!a || !b) return 0;
        return (b.name || '').localeCompare(a.name || '')
      } 
    },
  ];

  

  const getPromoActions = (promo) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical className="w-5 h-5 cursor-pointer text-gray-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEditClick(promo)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => togglePromoStatus(promo._id)}>
          <Pause className="h-4 w-4 mr-2" />
          {promo.status ? 'Pause' : 'Activate'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDeletePromo(promo._id)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const headerAction = (
    <button
      type="button"
      onClick={() => setOpenCreate(true)}
      className="flex items-center justify-center gap-[12px] px-[28px] py-[16px] rounded-[80px] text-white bg-blue-600 hover:bg-blue-700 cursor-pointer w-full md:w-auto"
    >
      <Plus className="w-5 h-5" />
      <span>Create Promo Code</span>
    </button>
  );

  const filterOptions = {
    date: true,
    status: false,
    customStatusOptions: []
  };

  return (
    <SidebarProvider>
      <AppSidebar mode="admin" />

      <PromoCodeDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSave={() => {
          setOpenCreate(false);
          fetchPromoData();
        }}
      />

      <EditPromoCodeDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleUpdatePromo}
        promoData={currentPromo}
      />

      <GenericTablePage
        title="PROMO CODES"
        data={promoData}
        columns={columns}
        sortOptions={sortOptions}
        filterOptions={filterOptions}
        filters={{ dateKey: "dob", statusKey: "status" }}
        getActions={getPromoActions}
        showHeaderAction={true}
        headerAction={headerAction}
        loading={loading}
      />
    </SidebarProvider>
  );
}