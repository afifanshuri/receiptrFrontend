import React, { useEffect, useState } from "react"
import { fetchStatistics } from "../../service/statisticsService";
import { setUserAuthenticated, setUserNotAuthenticated } from "../../redux/slices/userSlice";
import { refreshAccessToken } from "../../service/authService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import "./statisticsDisplay.css";

const StatisticsDisplay = () => {

    const [statistics, setStatistics] = useState(null);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadStats = async () => {
            try {
                console.log("Loading statistics for user: ", user.accessToken);
                const data = await fetchStatistics(user);
                setStatistics(data);
            } catch (error) {
                toast.error("An error occurred fetching statistics data!" + error);
            }
        };
        loadStats();
    }, [user]);

    return (<div id="statisticsContainer">
        <div className="statisticCard">
            <h3>Total Amount of Receipts Uploaded</h3>
            <p>{statistics ? statistics.totalNumberReceipts : 0}</p>
        </div>
        <div className="statisticCard">
            <h3>Total Spent</h3>
            <p>{statistics ? statistics.totalReceiptAmount : 0}</p>
        </div>
        <div className="statisticCard">
            <h3>Top 3 Latest Receipts</h3>
            {statistics ? statistics.top3LatestReceipts.map((receipt, index) => {
                return (
                    <div>
                        <p>{receipt.name}</p>
                        <p>{receipt.receiptAmount}</p>
                    </div>
                )
            }) : 0}
        </div>

        <div className="statisticCard">
            <h3>Top 3 Spendings</h3>
            {statistics ? statistics.top3Spending.map((receipt, index) => {
                return (
                    <div>
                        <p>{receipt.name}</p>
                        <p>{receipt.receiptAmount}</p>
                    </div>
                )
            }) : 0}
        </div>
    </div>)
}

export default StatisticsDisplay;

