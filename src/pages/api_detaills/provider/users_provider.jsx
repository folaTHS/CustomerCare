import { getAllUsersService, getUserDetailsService } from "../services/users_service";





export const getAllUsersProvider = async ({ updateUsers, updateErrorPopup, updateErrorText }) => {

    try {

        let response = await getAllUsersService()
        console.log("API Response:", response.data);

        if (response.status == 200) {
            console.log("Users Data:", response.data["responseBody"]);
            updateUsers(response.data["responseBody"]);

        }
        else {
            updateErrorText(response.data["responseMessage"]);
            console.log("Error:", err);
            updateErrorPopup(true)
            setTimeout(() => {
                updateErrorPopup(false)
            }, 2000)
        }




    } catch (err) {
        console.log("Error in catch:", err);
        updateErrorText(err.response.data.responseMessage || "Failed to fetch Users");
        updateErrorPopup(true)
        setTimeout(() => {
            updateErrorPopup(false)
        }, 2000)
    }


}

export const getUserDetailsProvider = async ({ updateUserDetails, phone, updateErrorText, updateErrorPopup }) => {


    try {

        let response = await getUserDetailsService(phone)

        if (response.status == 200 || response.status == 201) {

            updateUserDetails(response.data["responseBody"])

            console.log(response.data["responseBody"]);


        } else {
            updateLoadingPopup(false);
            updateErrorText(response.data["responseMessage"]);

            console.log("Error :", err);

            updateErrorPopup(true)
            setTimeout(() => {
                updateErrorPopup(false)
            }, 2000)
        }

    } catch (error) {

        updateErrorText(err.response.data.responseMessage || "Failed to fetch data");
        updateErrorPopup(true)
        setTimeout(() => {
            updateErrorPopup(false)
        }, 2000)

    }

}