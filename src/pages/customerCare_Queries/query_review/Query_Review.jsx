import React, { useEffect, useState } from 'react'
import Style from '../query_review/Query_Review.module.css'
import person from '../../../assets/images/Person1.png'
import ccImg from '../../../assets/images/ccImg.png'
import Header from '../../../components/header/Header'
import Input from '../../../components/SignUp_input/Input'
import Button from '../../../components/button/Button'
// import Staff_Card from '../../staff/all_staff/component/Staff_Card'
import ReactCalendarHeatmap from 'react-calendar-heatmap'
import Staff_Card from '../../../components/staff_card/Staff_Card'
import { PopupContextHook } from '../../../PopupContext'
import { useParams } from 'react-router-dom'
import { getEmail } from '../../api_detaills/constant/local_storage'
import { getQueryDetailsProvider, getQueryCountProvider } from '../../api_detaills/provider/query_provider'



const Query_Review = () => {

    // Extract ticketId from URL parameters
    let { ticketId } = useParams()

    // Destructure popup context hooks for managing popups
    const { 
        updateConfirmResolutionPopup, 
        updateConfirmEscalationPopup, 
        updateResolutionState, 
        updateLoadingPopup,
        updateErrorPopup,
        updateErrorText 
    } = PopupContextHook()

    // Function to handle escalation of a query
    const escalate = () => {

        updateConfirmEscalationPopup(true)
    }

    // Get today's date
    const today = new Date();

    // Function to generate a range of dates between startDate and endDate
    const getRange = (startDate, endDate) => {

        const date = new Date(startDate.getTime());
        const dates = [];

        while (date <= endDate) {
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    // Generate random values for the heatmap
    const randomValues = getRange(
        new Date(today.getFullYear(), today.getMonth() - 25, today.getDate()),
        today
    ).map((date) => ({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 4),
    }));

    // State to hold query details
    const [queryDetails, setQueryDetails] = useState({

        userDetails: [],
        customerCareAgentDetails: [],
        queries: []

    });

    // Effect to fetch query details when component mounts
    useEffect(() => {
        updateLoadingPopup(true);
        getQueryCountProvider({
            updateQueryCount: (data) => {
                if (data?.responseBody?.allQueries) {
                    const selectedQuery = data.responseBody.allQueries.find(
                        query => query.ticket_id === ticketId
                    );
                    
                    if (selectedQuery) {
                        setQueryDetails({
                            userDetails: [{
                                username: selectedQuery.username || "Anonymous",
                                phone: selectedQuery.phone || "N/A",
                                status: selectedQuery.status,
                                profile_picture: selectedQuery.profilePicture || person
                            }],
                            queries: [{
                                ticket_id: selectedQuery.ticket_id,
                                category: selectedQuery.category,
                                query: selectedQuery.query,
                                file: selectedQuery.file || "No attachment"
                            }],
                            customerCareAgentDetails: queryDetails.customerCareAgentDetails
                        });
                    }
                }
                updateLoadingPopup(false);
            },
            updateErrorPopup,
            updateErrorText
        });
    }, [ticketId]);

    
    const userDetails_arr = queryDetails.userDetails
    const customerCareDetails_arr = queryDetails.customerCareAgentDetails
    const queries_arr = queryDetails.queries


    // State to hold resolution details
    const [resolution, setResolution] = useState({
        query: [],
        email: '',
        ticket_id: ticketId,
        message: '',
    })
  
    
    // Function to handle form submission for resolution
    const confirm = (e) => {

        e.preventDefault()
        updateResolutionState({ 
            details: userDetails_arr, 
            query: queries_arr,
            email: resolution.email, 
            ticket_id: ticketId, 
            message: resolution.message, 
        })
        updateConfirmResolutionPopup(true)
    }


    // Function to handle input changes in the resolution form
    const Details = (e) => {

        const name = e.target.name
        const value = e.target.value

        setResolution(
            (prev) => ({
                ...prev,
                [name]: value
            })
        )
    }



    return (
        <div id={Style.Query_Review_mainDiv}>

            <Header
                headerText={"Review"}
                headerInfo={"let's get rolling"} />

            <div id={Style.Query_Review_wrapperDiv}>

                <p id={Style.queryText}>Query Details</p>

                <div id={Style.Query_Review_mapDiv}>

                    <p className={Style.Query_Review_headerText}>User</p>

                    {
                        userDetails_arr.map((obj) => {

                            return (
                                <Staff_Card
                                    img={obj.profile_picture}
                                    name={obj.username}
                                    position={obj.phone}
                                    status={obj.status} />
                            )
                        })
                    }
                </div>

                <p className={Style.Query_Review_headerText}>Query</p>

                <div id={Style.Query_Review_table_wrapperDiv}>

                    <table>

                        <thead>

                            <tr id={Style.headerTable}>
                                <th>Ticket ID</th>
                                <th>Query Category</th>
                                <th>Query</th>
                                <th>Attachment</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {
                                queries_arr.map((obj) => {

                                    return (
                                        <tr key={obj.ticket_id}>
                                            <td className={Style.Query_Review_headerText}>{obj.ticket_id}</td>
                                            <td className={Style.Query_Review_headerText}>{obj.category}</td>
                                            <td>
                                                <div id={Style.Query_td}>
                                                    {obj.query}
                                                </div>

                                            </td>
                                            <td className={Style.Query_Review_headerText}>{obj.file}</td>

                                            <td>
                                                <div id={Style.Query_Review_td_button}>

                                                    <button onClick={escalate}>Escalate</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>

                <div id={Style.resolution_customerDetails_Div}>

                    <div id={Style.resolution_mainDiv}>

                        <p id={Style.resolutionText}>Resolution</p>

                        <p id={Style.formText}>Fill details to continue</p>

                        <div id={Style.Query_Review_formDiv}>

                            <form action="">
                                <div id={Style.inputDiv}>
                                    <Input
                                        type={"email"}
                                        placeholder={"Type customer email"}
                                        label={"Customer Email"}
                                        name="email"
                                        value={resolution.email}
                                        onChange={Details} />

                                    <div id={Style.textareaDiv}>

                                        <textarea name="message"

                                            id={Style.textarea}
                                            placeholder="Type your resolution"
                                            value={resolution.message}
                                            onChange={Details}>

                                        </textarea>

                                        <label id={Style.label}>Resolution</label>
                                    </div>
                                    {/* <button onClick={confirm} style={{backgroundColor: "#000000"}}>jwnujf</button> */}


                                    <Button text={"Send Resolution"} onClick={confirm} />
                                </div>
                            </form>

                        </div>

                    </div>

                    {
                        customerCareDetails_arr.map((obj) => {

                            return (
                                <div id={Style.customerDetails_Div} key={obj.email}>
                                    <p id={Style.onboardedText}>Date Onboarded : 9 Oct 2024</p>

                                    <div id={Style.img_infoDiv}>

                                        <img id={Style.customerCare_img} src={ccImg} alt="" />
                                        <p id={Style.name}>{obj.fullname}</p>
                                        <p className={Style.position}>Customer care representative</p>
                                        <p id={Style.statusDiv}><div id={Style.status}></div>Online</p>



                                    </div>

                                    <div id={Style.CC_personalinfo}>
                                        <div className={Style.date_email_Info}>
                                            <p className={Style.details_Header}>Email:</p>
                                            <p className={Style.detailsText}>{obj.email}</p>
                                        </div>
                                        <div className={Style.date_email_Info}>
                                            <p className={Style.details_Header}>Phone:</p>
                                            <p className={Style.detailsText}>{obj.phone_number}</p>
                                        </div>
                                    </div>

                                    <p id={Style.performanceText}>Performance</p>

                                    <ReactCalendarHeatmap

                                        startDate={new Date('2024-01-01')}
                                        endDate={new Date('2024-12-01')}
                                        values={randomValues}
                                        classForValue={(value) => {
                                            if (!value) {
                                                return 'color-empty';
                                            }
                                            return `color-scale-${value.count}`;
                                        }}
                                        tooltipDataAttrs={(value) => {
                                            return {
                                                'data-tip': value.date ? `${value.date}: ${value.count}` : 'No data',
                                            };
                                        }}
                                        showWeekdayLabels

                                    />

                                </div>


                            )
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default Query_Review