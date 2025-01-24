import React, { useEffect, useState } from 'react'
import Style from './Dashboard.module.css'
import Header from "../../components/header/Header"
import Progress_Bar from '../../components/progress_bar/Progress_Bar'
import InputField from '../../components/input/InputField'
import search from '../../assets/svg/Search.svg'
import blue from '../../assets/svg/blue.svg'
import black from '../../assets/svg/black.svg'
import gold from '../../assets/svg/gold.svg'
import arrow_down from '../../assets/svg/arrow_down-dark.svg'
import Button from '../../components/button/Button'
import { Link } from 'react-router-dom'
import { PopupContextHook } from '../../PopupContext'
import no_complaint from '../../assets/svg/no_complaint.svg'
import { getQueryCountProvider } from '../api_detaills/provider/query_provider'
import person from '../../assets/svg/person.svg'
import { getMetricsService } from '../api_detaills/services/query_services'

const Dashboard = () => {


    const { updateLoadingPopup, updateErrorText, updateErrorPopup } = PopupContextHook();
    const [showAllQueries, setShowAllQueries] = useState(false);



    const [queryCounts, setQueryCount] = useState({
        inAppMessages: 0,
        pending: 0,
        resolved: 0,
        escalated: 0,
        firstThreeIncomingQueries: [],
        performanceMetrics: {
            firstContactResolution: 0,
            customerSatisfaction: 0,
            resolutionTime: 0,
            responseTime: 0
        }
    });



    useEffect(() => {
        // Get queries data
        getQueryCountProvider({
            updateQueryCount: (data) => {
                if (data?.responseBody) {
                    setQueryCount(prevState => ({
                        ...prevState,
                        inAppMessages: data.responseBody.inAppMessages || 0,
                        pending: data.responseBody.pending || 0,
                        resolved: data.responseBody.resolved || 0,
                        escalated: data.responseBody.escalated || 0,
                        firstThreeIncomingQueries: data.responseBody.allQueries?.slice(0, 3) || []
                    }));
                }
            },
            updateErrorPopup,
            updateErrorText
        });

        // Get metrics data
        getMetricsService()
            .then(response => {
                if (response?.data?.responseBody) {
                    setQueryCount(prevState => ({
                        ...prevState,
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

    console.log("Current state:", queryCounts);

    const toggleQueries = () => {
        setShowAllQueries(!showAllQueries);
    };

    const incomingQueries = queryCounts.firstThreeIncomingQueries


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
        <div id={Style.CustomerCare_Dashboard_mainDiv}>

            <Header
                headerText={"Welcome John"}
                headerInfo={"Here's an information on all Users"}
                back1={false} />

            <div id={Style.CustomerCare_Dashboard_wrapperDiv}>

                <div id={Style.Dashboard_CardDiv}>

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
                            <Link to="/incomingQueries" style={{ textDecoration: 'none' }}>
                                <p>View All</p>
                            </Link>
                        </div>

                        <div id={Style.Dashboard_TicketWrapperDiv}>


                            <div id={Style.ticketButtonDiv}>
                                <button 
                                    className={Style.toggle_buttonActive}
                                    style={{
                                        color: "#0E093C",
                                        backgroundColor: "transparent",
                                        fontSize: "1.12rem",
                                        border: "none",
                                        paddingBottom: "0.5rem",
                                        boxSizing: "border-box",
                                        borderBottom: "1px solid #0E093C",
                                        cursor: "pointer"
                                    }}
                                >
                                    All
                                </button>
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
                                        {(showAllQueries ? queryCounts.allQueries : queryCounts.firstThreeIncomingQueries).length > 0 ? (
                                            (showAllQueries ? queryCounts.allQueries : queryCounts.firstThreeIncomingQueries).map((query, index) => (
                                                <tr key={index} id={Style.Personal_Info_tr}>
                                                    <td>
                                                        <div className={Style.userInfo}>
                                                            <img 
                                                                src={person} 
                                                                alt="" 
                                                                style={{ 
                                                                    borderRadius: "50px",
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    objectFit: "cover"
                                                                }} 
                                                            />
                                                            <span style={{ color: "#000000" }}>{query.username || "Anonymous"}</span>
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
                                        ) : (
                                            <tr>
                                                <td colSpan="4">
                                                    <div className={Style.no_queryDiv}>
                                                        <img src={no_complaint} alt="" />
                                                        <p>No Incoming Queries</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
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

                                <Link to={"/performance"}><button>See All</button></Link>

                            </div>
                        </div>


                        <div id={Style.Staff_details_Daily_CallDiv}>

                            <table>
                                <thead>
                                    <tr>
                                        <td>Days</td>
                                        <td className={Style.Daily_CallText}>Calls</td>
                                        <td className={Style.Daily_CallText}>Mails</td>
                                        <td className={Style.Daily_CallText}>Msg</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Monday</td>
                                        <td className={Style.Daily_CallText}>46</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td className={Style.Daily_CallText}>5</td>
                                        <td>
                                            <button style={{ 
                                                backgroundColor: "transparent", 
                                                border: "none", 
                                                color: "#0E093C", 
                                                fontSize: "0.75rem", 
                                                borderRadius: "0.5rem", 
                                                height: "1.87rem", 
                                                width: "5.12rem" 
                                            }}>
                                                View Details
                                            </button>
                                        </td>
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

export default Dashboard