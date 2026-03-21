import apiClient from "../apiClient";

const pickupSlotService = {
  // Get all pickup slots
  getPickupSlots: async () => {
    return apiClient.get("/pickup-slots");
  },

  // Get pickup slot by ID
  getPickupSlotById: async (id) => {
    return apiClient.get(`/pickup-slots/${id}`);
  },

  // Create pickup slot
  createPickupSlot: async (data) => {
    return apiClient.post("/pickup-slots/create", data);
  },

  // Update pickup slot
  updatePickupSlot: async (id, data) => {
    return apiClient.put(`/pickup-slots/${id}`, data);
  },

  // Delete pickup slot
  deletePickupSlot: async (id) => {
    return apiClient.delete(`/pickup-slots/${id}`);
  },
};

export default pickupSlotService;
