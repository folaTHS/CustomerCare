import React, { useEffect, useState } from 'react'
import Style from '../customerCare_Queries/CustomerCare_Queries.module.css'
import Header from '../../components/header/Header'
import users from '../../assets/svg/total_users.svg'
import issues from '../../assets/svg/Issues.svg'
import person from '../../assets/svg/person.svg'
import Total_Card from '../../components/total_Card/Total_Card'
import arrow_down from '../../assets/svg/arrow_down.svg'
import blue from '../../assets/svg/blue.svg'
import black from '../../assets/svg/black.svg'
import gold from '../../assets/svg/gold.svg'
import no_complaint from '../../assets/svg/no_complaint.svg'
import Button from '../../components/button/Button'
import Progress_Bar from '../../components/progress_bar/Progress_Bar'
import { PopupContextHook } from '../../PopupContext'
// import { getQueryCountProvider } from '../api_detaills/provider/auth_provider'
import { Link } from 'react-router-dom'
import { getQueryCountProvider } from '../api_detaills/provider/query_provider'
import { getMetricsService } from '../api_detaills/services/query_services'




const CustomerCare_Queries = () => {

    const { updateLoadingPopup, updateErrorText, updateErrorPopup } = PopupContextHook();

    let [toggleIndex, setToggleIndex] = useState(100);


    const [queryCounts, setQueryCount] = useState({
        inAppMessages: 0,
        pending: 0,
        resolved: 0,
        escalated: 0,
        firstThreeIncomingQueries: [],
        totalQueries: 0,
        totalStaff: 0,
        performanceMetrics: {
            firstContactResolution: 0,
            customerSatisfaction: 0,
            resolutionTime: 0,
            responseTime: 0
        }
    })



    useEffect(() => {

        getQueryCountProvider({

            updateQueryCount: (data) => {
                if (data?.responseBody) {
                    setQueryCount(prevState => ({
                        ...prevState,
                        inAppMessages: data.responseBody.inAppMessages || 0,
                        pending: data.responseBody.pending || 0,
                        resolved: data.responseBody.resolved || 0,
                        escalated: data.responseBody.escalated || 0,
                        firstThreeIncomingQueries: data.responseBody.allQueries || [],
                        totalQueries: data.responseBody.totalQueries || 0,
                        totalStaff: data.responseBody.totalStaff || 0
                    }));
                }
            },
            updateErrorPopup,
            updateErrorText
        });

        getMetricsService()
            .then(response => {
                if (response?.data?.responseBody) {
                    setQueryCount(prevState => ({
                        ...prevState,
                        totalQueries: response.data.responseBody.totalQueries || 0,
                        totalStaff: response.data.responseBody.totalStaff || 0,
                        performanceMetrics: {
                            firstContactResolution: response.data.responseBody.customerSatisfactionRate?.replace('%', '') || 0,
                            customerSatisfaction: response.data.responseBody.customerSatisfactionRate?.replace('%', '') || 0,
                            resolutionTime: response.data.responseBody.averageResolutionTime?.replace('%', '') || 0,
                            responseTime: response.data.responseBody.averageResponseTime?.replace('%', '') || 0
                        }
                    }));
                }
            })
            .catch(error => {
                console.error("Metrics Error:", error);
            });

    }, []);



    const totalMessages = queryCounts.inAppMessages
    const totalPending = queryCounts.pending
    const totalResolved = queryCounts.resolved
    const totalEscalated = queryCounts.escalated
    const incomingQueries = queryCounts.firstThreeIncomingQueries



    const stats_card7 = [
        {
            image1: users,
            price: queryCounts.totalQueries || 0,
            text: "App Message Queries",
            to: "/message_queries",
            divText: "View All"
        },
        {
            image1: users,
            price: queryCounts.pending || 0,
            text: "In- App Call Queries",
            to: "/callQueries",
            divText: "View All"
        },
        {
            image1: issues,
            price: queryCounts.totalStaff || 0,
            text: "Toll Calls Queries",
            to: "",
            divText: "View All"
        },
    ]

    const ticket_arr = [
        {
            image1: users,
            price: queryCounts.pending || 0,
            text: "Incoming Queries",
            to: "/incomingQueries",
            divText: "View All"
        },
        {
            image1: issues,
            price: queryCounts.resolved || 0,
            text: "Resolved Queries",
            to: "/resolvedQueries",
            divText: "View All"
        },
        {
            image1: issues,
            price: queryCounts.escalated || 0,
            text: "Escalated Queries",
            to: "/escalatedQueries",
            divText: "View All"
        },
    ]


    const progressDiv = [
        {
            text: "Average First Contact Resolution Rate",
            percent: `${queryCounts.performanceMetrics.firstContactResolution}%`,
            infoText: "First contact resolution rate for customer queries"
        },
        {
            text: "Average Customer Satisfaction Rate",
            percent: `${queryCounts.performanceMetrics.customerSatisfaction}%`,
            infoText: "Overall customer satisfaction rating"
        },
        {
            text: "Average Resolution Time",
            percent: `${queryCounts.performanceMetrics.resolutionTime}%`,
            infoText: "Average time taken to resolve queries"
        },
        {
            text: "Average Response Time",
            percent: `${queryCounts.performanceMetrics.responseTime}%`,
            infoText: "Average initial response time for queries"
        }
    ]




    return (

        <div id={Style.Queries_mainDiv}>

            <Header
                headerText={"Queries"}
                headerInfo={"let's get rolling"} />

            <div id={Style.Queries_wrapperDiv}>

                <p id={Style.Queries_headerText}>Queries</p>

                <div id={Style.Queries_mapDiv}>

                    {
                        stats_card7.map((obj, index) => {

                            return (
                                <Total_Card
                                    Key={index}
                                    image1={obj.image1}
                                    price={obj.price}
                                    text={obj.text}
                                    to={obj.to}
                                    divText={obj.divText}
                                />

                            )
                        })
                    }
                </div>

                <div id={Style.ticket_mapDiv}>

                    {
                        ticket_arr.map((obj, index) => {

                            return (
                                <Total_Card
                                    Key={index}
                                    image1={obj.image1}
                                    price={obj.price}
                                    text={obj.text}
                                    to={obj.to}
                                    divText={obj.divText}
                                />

                            )
                        })
                    }
                </div>


                <div id={Style.Performance_CardDiv}>

                    {
                        progressDiv.map((obj, index) => {

                            return (

                                <Progress_Bar
                                    key={index}
                                    text={obj.text}
                                    infoText={obj.infoText}
                                    percent={obj.percent} />
                            )
                        })
                    }

                </div>



                <div id={Style.Dashboard_Ticket_PerformanceDiv}>

                    <div id={Style.Ticket_entireDiv}>

                        <div id={Style.AssignedTicket_textDiv}>

                            <p>Incoming Queries</p>

                            <Link to={"/incomingQueries"}><p> View All </p></Link>
                        </div>

                        <div id={Style.Dashboard_TicketWrapperDiv}>

                            {/* <div id={Style.Ticket_HeaderDiv}> */}

                            <div id={Style.ticketButtonDiv}>

                                <button onClick={() => ticketToggle(0)} className={toggleIndex == 0 ? Style.toggle_buttonActive : Style.ticketButton}>All</button>
                            </div>


                            <div id={Style.ticketTable_wrapperDiv}>

                                <table className={Style.dashboardTable}>

                                    <thead>

                                        <tr id={Style.headerTable}>

                                            <th>User</th>
                                            <th>Ticket No</th>
                                            <th>QueryType</th>
                                            <th>Action</th>
                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            incomingQueries && incomingQueries.slice(0, 4).map((query, index) => (
                                                <tr key={index} id={Style.Personal_Info_tr}>
                                                    <td>
                                                        <div className={Style.userInfo} style={{ color: "#000000", display: "flex", alignItems: "center" }}>
                                                            <img 
                                                                src={person} 
                                                                alt="" 
                                                                style={{ 
                                                                    borderRadius: "50px",
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    objectFit: "cover",
                                                                    marginRight: "10px"
                                                                }}
                                                            />
                                                            {query.username || "Anonymous"}
                                                        </div>
                                                    </td>
                                                    <td className={Style.tableText} style={{ color: "#000000" }}>{query.ticket_id}</td>
                                                    <td className={Style.tableText} style={{ color: "#000000" }}>{query.query_type_name}</td>
                                                    <td>
                                                        <Link to={`/QueryReview/${query.ticket_id}`}>
                                                            <button style={{ 
                                                                backgroundColor: "#0E093C", 
                                                                border: "none", 
                                                                color: "#FFFFFF", 
                                                                fontSize: "0.7rem", 
                                                                width: "5.18rem", 
                                                                borderRadius: "8px", 
                                                                height: "1.37rem" 
                                                            }}>
                                                                Accept
                                                            </button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }


                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>

                    <div id={Style.performanceDiv}>

                        <div id={Style.Daily_Call_headerDiv}>
                            <p>Performance</p>

                            <div id={Style.dateDiv}>

                                <p id={Style.dateText}>Week One October, 2024 <img src={arrow_down} alt="" /></p>

                                <Link to={"/performance"}>
                                    <button>See All</button>
                                </Link>

                            </div>
                        </div>


                        <div id={Style.Staff_details_Daily_CallDiv}>

                            <table>

                                <tbody>

                                    <tr>
                                        <td>Days</td>
                                        <td className={Style.Daily_CallText}>Calls</td>
                                        <td className={Style.Daily_CallText}>Mails</td>
                                        <td className={Style.Daily_CallText}>Msg</td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td>Monday</td>
                                        <td className={Style.Daily_CallText}>46</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Tuesday</td>
                                        <td className={Style.Daily_CallText}>22</td>
                                        <td className={Style.Daily_CallText}>13</td>
                                        <td className={Style.Daily_CallText}>13</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Wednesday</td>
                                        <td className={Style.Daily_CallText}>45</td>
                                        <td className={Style.Daily_CallText}>8</td>
                                        <td className={Style.Daily_CallText}>8</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Thursday</td>
                                        <td className={Style.Daily_CallText}>34</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td className={Style.Daily_CallText}>77</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Friday</td>
                                        <td className={Style.Daily_CallText}>89</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Saturday</td>
                                        <td className={Style.Daily_CallText}>33</td>
                                        <td className={Style.Daily_CallText}>13</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                    <tr>
                                        <td>Sunday</td>
                                        <td className={Style.Daily_CallText}>21</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td className={Style.Daily_CallText}>44</td>
                                        <td><button style={{ backgroundColor: "transparent", border: "none", color: "#0E093C", fontSize: "0.75rem", borderRadius: "0.5rem", height: "1.87rem", width: "5.12rem" }}>View Details</button></td>
                                    </tr>

                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>




            </div>
        </div>
    )
}

export default CustomerCare_Queries