import { axiosInstance } from "../axios/axios";

export const getUsersService = async () => {
    try {
        const response = await axiosInstance.get('/users');
        return response;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}; 