import React, { useState } from "react";
import '../styles/MainScreenStyle.css'
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { faCamera, faReceipt, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainScreen = () => {
    const user = useSelector((state) => state.user);
    const [askAiEnabled, setaskAiEnabled] = useState(false);

    function onTriggerAskAi() {
        setaskAiEnabled(!askAiEnabled);
        console.log("askAiEnabled: " + askAiEnabled);
    }
    const navigate = useNavigate();
    return (
        <div id="mainScreen-mainContainer">
            <h1>Welcome, {user.profile.firstName}</h1>
            {
                askAiEnabled && <input id="aiSearchBar" type="text" placeholder="What are you looking for?" />
            }

            <div id="mainScreen-buttonContainer">
                <Button className="clickableButton" onClick={() => navigate("/dashboard")}>List of Receipts <FontAwesomeIcon icon={faReceipt} /></Button>
                <Button className="clickableButton" onClick={() => { navigate("/scan") }}>Scan A Receipt <FontAwesomeIcon icon={faCamera} /></Button>
                <Button className="clickableButton" onClick={() => { onTriggerAskAi() }}>Ask receiptrBot<FontAwesomeIcon icon={faRobot} /></Button>
            </div>

            <div id="statisticsContainer">
                <div className="statisticCard">
                    <h3>Latest Receipts Uploaded</h3>
                    <p>15</p>
                </div>
                <div className="statisticCard">
                    <h3>Total Spent</h3>
                    <p>$250.0000</p>
                </div>
                <div className="statisticCard">
                    <h3>Total Spent</h3>
                    <p>$250.00</p>
                </div>
            </div>
        </div>
    )
};

export default MainScreen;
