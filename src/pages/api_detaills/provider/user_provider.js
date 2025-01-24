import { getUsersService } from "../services/user_services";

export const getUsersProvider = async ({ updateUserCount, updateErrorPopup, updateErrorText }) => {
    try {
        const response = await getUsersService();
        if (response?.data?.responseSuccessful) {
            updateUserCount(response.data);
        } else {
            updateErrorPopup(true);
            updateErrorText(response?.data?.responseMessage || "Error fetching users");
        }
    } catch (error) {
        updateErrorPopup(true);
        updateErrorText("Error fetching users");
    }
}; 