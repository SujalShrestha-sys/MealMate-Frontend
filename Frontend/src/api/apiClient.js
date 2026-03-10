import axios from 'axios';
import toast from 'react-hot-toast';


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        // Return only the data part of the response for easier consumption
        return response.data;
    },
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // Handle specific status codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized: Clear token and redirect to login if necessary
                    localStorage.removeItem('token');
                    // You could also trigger a logout action from your state store here
                    toast.error('Session expired. Please login again.');
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error('Resource not found.');
                    break;
                case 500:
                    toast.error('Internal server error. Please try again later.');
                    break;
                default:
                    toast.error(message);
            }
        } else if (error.request) {
            // Direct request error (e.g., network timeout)
            toast.error('Network error. Please check your connection.');
        } else {
            toast.error(message);
        }

        return Promise.reject(message);
    }
);

export default apiClient;
