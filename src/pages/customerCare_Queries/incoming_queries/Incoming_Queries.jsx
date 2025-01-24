import React, { useEffect, useState } from 'react'
import Style from './Incoming_Queries.module.css'
import search from '../../../assets/svg/Search.svg'
import microphone from '../../../assets/svg/microphone.svg'
import capture from '../../../assets/svg/capture.svg'
import recording from '../../../assets/svg/recording.svg'
import filter from '../../../assets/svg/Complete_filter_img.svg'
import InputField from '../../../components/input/InputField'
import Header from '../../../components/header/Header'
import { Link } from 'react-router-dom'
import avatar from '../../../assets/images/avatar.png'
import Button from '../../../components/button/Button'
import blue from '../../../assets/svg/blue.svg'
import gold from '../../../assets/svg/gold.svg'
import black from '../../../assets/svg/black.svg'
import { PopupContextHook } from '../../../PopupContext'
import { getQueryCountProvider } from '../../api_detaills/provider/query_provider'
import person from '../../../assets/svg/person.svg'
import no_complaint from '../../../assets/svg/no_complaint.svg'




const Incoming_Queries = () => {

    const { updateLoadingPopup, updateErrorText, updateErrorPopup } = PopupContextHook();
    const [searchQuery, setSearchQuery] = useState("");

    const [incomingQueriesState, setIncomingQueries] = useState({
        incomingQueries: []
    })

    useEffect(() => {
        updateLoadingPopup(true);
        getQueryCountProvider({
            updateQueryCount: (data) => {
                if (data?.responseBody?.allQueries) {
                    setIncomingQueries({
                        incomingQueries: data.responseBody.allQueries
                    });
                }
                updateLoadingPopup(false);
            },
            updateErrorPopup,
            updateErrorText
        });
    }, []);

    // Filter queries based on search
    const filteredQueries = incomingQueriesState.incomingQueries.filter(query => 
        query.ticket_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle search input change
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div id={Style.Incoming_Queries_mainDiv}>

            <Header
                headerText={"Incoming Queries"}
                headerInfo={"let's get rolling"}
            />

            <div id={Style.Incoming_Queries_wrapperDiv}>

                <div id={Style.Query_incomingTextDiv}>
                    <p>Incoming</p>

                    <div id={Style.search_filterDiv}>
                        <div id={Style.searchDiv}>
                            <img 
                                src={search} 
                                alt="" 
                            />
                            <input
                                type="text"
                                placeholder="Search ticket no"
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </div>
                        <img id={Style.filterImg} src={filter} alt="" />
                    </div>
                </div>

                <div id={Style.Incoming_Queries_tableWrapperDiv} style={{ 
                    width: "100%", 
                    overflowX: "auto",
                    paddingLeft: "0"
                }}>
                    <table style={{ 
                        width: "100%",
                        tableLayout: "auto",
                        marginLeft: "0"
                    }}>

                        <thead>

                            <tr id={Style.headerTable}>
                                <th>S/N</th>
                                <th>Date</th>
                                <th>TicketID</th>
                                <th>Category</th>
                                <th>Username</th>
                                <th>QueryType</th>
                                <th>Query</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                        </thead>


                        <tbody>
                            
                            {filteredQueries.length > 0 ? (
                                filteredQueries.map((obj, index) => {
                                    return (
                                        <tr id={Style.Personal_Info_tr} key={index}>
                                            <td>{index + 1}</td>
                                            <td>{new Date().toLocaleDateString()}</td>
                                            <td className={Style.tableText}>{obj.ticket_id}</td>
                                            <td className={Style.tableText}>{obj.category}</td>
                                            <td>
                                                <div id={Style.usernameText}>
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
                                                    <span>{obj.username || "Anonymous"}</span>
                                                </div>
                                            </td>
                                            <td className={Style.tableText}>{obj.query_type_name}</td>
                                            <td>
                                                <p className={Style.ReportText}>{obj.query}</p>
                                            </td>
                                            <td><div id={Style.statusText}>{obj.status}</div></td>
                                            <td>
                                                <Link to={`/QueryReview/${obj.ticket_id}`}>
                                                    <button style={{ backgroundColor: "#0E093C", border: "none", color: "#FFFFFF", fontSize: "0.7rem", width: "5.18rem", borderRadius: "8px", height: "1.37rem" }}>
                                                        Review
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9">
                                        <div className={Style.no_queryDiv}>
                                            <img src={no_complaint} alt="" />
                                            <p>No matching queries found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}



                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}

export default Incoming_Queries