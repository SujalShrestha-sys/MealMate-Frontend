import React, { useState, useEffect, useMemo } from "react";
import { Box, Card, Grid } from "@mui/material";
import AdminLayout from "../../components/admin/AdminLayout";
import pickupSlotService from "../../api/services/pickupSlot.service";
import SlotModals from "../../components/admin/slots/SlotModals";
import SlotHeader from "../../components/admin/slots/SlotHeader";
import SlotCalendar from "../../components/admin/slots/SlotCalendar";
import SlotTable from "../../components/admin/slots/SlotTable";

const SlotManagementPage = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await pickupSlotService.getPickupSlots();
      if (response.success) {
        setSlots(response.data);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  const handleEdit = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (slot) => {
    setSelectedSlot(slot);
    setIsDeleteModalOpen(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const selectedDateSlots = useMemo(() => {
    return slots
      .filter(
        (slot) =>
          new Date(slot.startTime).toDateString() ===
          selectedDate.toDateString(),
      )
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [slots, selectedDate]);

  return (
    <AdminLayout activePath="/admin/slots">
      <Box sx={{ width: "100%", p: { xs: 2, sm: 3 } }}>
        <SlotHeader />

        <Grid container spacing={{ xs: 2.5, sm: 3 }}>
          {/* Calendar Selection Card */}
          <Grid size={{ xs: 12, md: 4, lg: 3.5 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                bgcolor: "#ffffff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
                height: "100%",
                minHeight: { xs: "auto", md: "320px" },
                overflow: "hidden",
              }}
            >
              <SlotCalendar
                currentMonth={currentMonth}
                currentYear={currentYear}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                months={months}
                slots={slots}
              />
            </Card>
          </Grid>

          {/* Active Slots Table Card */}
          <Grid size={{ xs: 12, md: 8, lg: 8.5 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                bgcolor: "#ffffff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)",
                minHeight: { xs: "400px", md: "520px" },
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <SlotTable
                loading={loading}
                selectedDate={selectedDate}
                selectedDateSlots={selectedDateSlots}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </Card>
          </Grid>
        </Grid>

        {/* Modals */}
        <SlotModals
          mode="edit"
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          slot={selectedSlot}
          onSuccess={fetchSlots}
          selectedDate={selectedDate}
        />
        <SlotModals
          mode="delete"
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          slot={selectedSlot}
          onSuccess={fetchSlots}
        />
      </Box>
    </AdminLayout>
  );
};

export default SlotManagementPage;
