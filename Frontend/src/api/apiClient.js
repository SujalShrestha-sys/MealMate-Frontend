import axios from "axios";
import toast from "react-hot-toast";

// Create axios instance
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed for httpOnly refresh token cookie
  timeout: 15000,
});

//Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Handle responses & auto-refresh on 401
let isRefreshing = false;
let waitingRequests = [];

apiClient.interceptors.response.use(
  // Success: just return the data
  (response) => response.data,

  // Error: try to refresh if 401
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    // ── Auto-refresh logic ──
    if (status === 401 && !originalRequest._retry) {
      // Don't refresh the refresh request itself
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        forceLogout();
        return Promise.reject(message);
      }

      // If already refreshing, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitingRequests.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        });
      }

      // Start refreshing
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newToken = res.data?.tokens?.accessToken;
        if (!newToken) throw new Error("No token returned");

        localStorage.setItem("accessToken", newToken);

        // Retry all waiting requests
        waitingRequests.forEach((req) => req.resolve(newToken));
        waitingRequests = [];

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        waitingRequests.forEach((req) => req.reject(error));
        waitingRequests = [];
        forceLogout();
        return Promise.reject(message);
      } finally {
        isRefreshing = false;
      }
    }

    // ── Show error toasts for other statuses ──
    if (status === 403) toast.error("You don't have permission.");
    else if (status === 404) toast.error("Resource not found.");
    else if (status === 500) {
      if (
        message.includes("Foreign key constraint violated") ||
        message.includes("_fkey")
      ) {
        toast.error(
          "Database constraint error. This usually happens when trying to delete records with related data.",
          { duration: 6000 },
        );
      } else if (message.includes("userId")) {
        toast.error("Session mismatch. Please log out and back in.", {
          duration: 5000,
        });
      } else {
        toast.error("Server error. Try again later.");
      }
    } else if (!error.response)
      toast.error("Network error. Check your connection.");
    else toast.error(message);

    return Promise.reject(message);
  },
);

// Clear everything and redirect to login
function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  toast.error("Session expired. Please login again.");
  window.location.href = "/login";
}

export default apiClient;
