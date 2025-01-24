import React, { useEffect, useState } from 'react'
import Style from './All_Users.module.css'
import Staff_Card from '../../../components/staff_card/Staff_Card'
import blue from '../../../assets/svg/blue.svg'
import gold from '../../../assets/svg/gold.svg'
import black from '../../../assets/svg/black.svg'
import arrow_down from '../../../assets/svg/arrow_down-dark.svg'
import search from '../../../assets/svg/Search.svg'
import InputField from '../../../components/input/InputField'
import Header from '../../../components/header/Header'
import { getAllUsersProvider } from '../../api_detaills/provider/users_provider'
import { PopupContextHook } from '../../../PopupContext'
import person from '../../../assets/svg/person.svg'

const All_Users = () => {
    const { updateErrorText, updateErrorPopup } = PopupContextHook()
    const [toggleIndex, setToggleIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState({
        allUsers: [],
        subscribedUsers: [],
        unsubscribedUsers: []
    })

    // Filter function
    const filterUsers = (array) => {
        return array.filter(user => 
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery)
        );
    };

    // Get filtered arrays based on search
    const filteredAllUsers = filterUsers(users.allUsers);
    const filteredSubscribedUsers = filterUsers(users.subscribedUsers);
    const filteredUnsubscribedUsers = filterUsers(users.unsubscribedUsers);

    // Fetch user data on component mount
    useEffect(() => {
        getAllUsersProvider({
            updateUsers: (data) => {
                if (data) {
                    setUsers({
                        allUsers: data.allUsers || [],
                        subscribedUsers: data.subscribedUsers || [],
                        unsubscribedUsers: data.unsubscribedUsers || []
                    });
                }
            },
            updateErrorPopup,
            updateErrorText
        });
    }, []);

    // Function to handle toggle button clicks
    const transactionToggle = (index) => {
        setToggleIndex(index)
    }

    // Destructure user arrays for easier access
    const subscribedUsers_arr = users.subscribedUsers
    const allUsers_arr = users.allUsers
    const unsubscribedUsers_arr = users.unsubscribedUsers

    return (
        <div id={Style.All_Users_mainDiv}>
            <Header headerText={"Users"} />
            <div id={Style.All_Users_wrapperDiv}>
                <div id={Style.All_Users_headerDiv}>
                    <div id={Style.All_Users_toggle_dateDiv}>
                        <div id={Style.All_Users_toggleDiv}>
                            <button onClick={() => transactionToggle(0)} className={toggleIndex == 0 ? Style.toggleDiv_buttonActive : Style.All_Users_listDiv_button}>All</button>
                            <button onClick={() => transactionToggle(1)} className={toggleIndex == 1 ? Style.toggleDiv_buttonActive : Style.All_Users_listDiv_button}>Subscribed</button>
                            <button onClick={() => transactionToggle(2)} className={toggleIndex == 2 ? Style.toggleDiv_buttonActive : Style.All_Users_listDiv_button}>Unsubscribed</button>
                        </div>
                        <div id={Style.All_Users_searchDiv}>
                            <img src={search} alt="search" className={Style.searchIcon} />
                            <InputField
                                type="text"
                                placeholder="Search by username or phone"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={Style.searchInput}
                            />
                        </div>
                    </div>
                </div>

                <div id={Style.All_Users_Card}>
                    {toggleIndex === 0 && filteredAllUsers.map((object, index) => {
                        let verify = object.subscription_type?.toLowerCase() === "blue" ? blue
                            : object.subscription_type?.toLowerCase() === "gold" ? gold
                            : object.subscription_type?.toLowerCase() === "black" ? black
                            : "";

                        return (
                            <Staff_Card
                                key={index}
                                img={object.profile_picture || person}
                                verified={verify}
                                status={object.status}
                                name={object.username}
                                position={object.country}
                                to={`/userDetails/${object.phone}`}
                            />
                        )
                    })}
                    
                    {toggleIndex === 1 && filteredSubscribedUsers.map((object, index) => {
                        let verify = object.subscription_type?.toLowerCase() === "blue" ? blue
                            : object.subscription_type?.toLowerCase() === "gold" ? gold
                            : object.subscription_type?.toLowerCase() === "black" ? black
                            : "";

                        return (
                            <Staff_Card
                                key={index}
                                img={object.profile_picture || person}
                                verified={verify}
                                status={object.status}
                                name={object.username}
                                position={object.country}
                                to={`/userDetails/${object.phone}`}
                            />
                        )
                    })}
                    
                    {toggleIndex === 2 && filteredUnsubscribedUsers.map((object, index) => {
                        return (
                            <Staff_Card
                                key={index}
                                img={object.profile_picture || person}
                                status={object.status}
                                name={object.username}
                                position={object.country}
                                to={`/userDetails/${object.phone}`}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default All_Users