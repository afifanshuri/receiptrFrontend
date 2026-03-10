import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import "./ReceiptDisplay.css"
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { refreshAccessToken } from "../../service/authService";
import { setAccessToken, setUserAuthenticated } from "../../redux/slices/userSlice";

const ReceiptDisplay = () => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchReceipt() {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/receipt/view/${id}`, { headers: { Authorization: `Bearer ${user.accessToken}` } });
                setReceipt(response.data);
                setLoading(false);
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    try {
                        console.log("Refreshing token...");
                        const token = await refreshAccessToken();
                        if (token !== null) {
                            dispatch(setUserAuthenticated(true));
                            dispatch(setAccessToken(token));
                            console.log("Token refreshed: " + token);
                        } else {
                            dispatch(setUserAuthenticated(false));
                        }
                        if (user.isAuthenticated) {
                            try {
                                console.log("token in user:" + user.accessToken);
                                const response = await axios.get(`http://localhost:8080/api/receipt/view/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                                setReceipt(response.data);
                                setLoading(false);
                                toast.success("Upload Successful after token refresh");
                            } catch (error) {
                                console.error("Upload failed after token refresh:", error);
                                toast.error("An Error occurred during upload after token refresh");
                            }
                        } else {
                            toast.error("Token refresh failed. Please log in again.");
                        }
                    } catch (error) {
                        console.error("Upload failed after token refresh:", error);
                        toast.error("An Error occurred during upload after token refresh");
                    }
                } else {
                    console.error("Error fetching receipt:", error);
                    toast.error("An error occurred while fetching the receipt.");
                }
            };
        }
        fetchReceipt();
    }, [id]);

    if (loading) {
        return <div>
            <PropagateLoader loading={loading} />
        </div>;
    }

    return (
        <>
            <h1>Receipt Display</h1>
            <div id="mainCardContainer">
                <Card className="receiptCard">
                    <CardHeader>
                        <CardTitle id="receiptTitle">INVOICE #{receipt.id}</CardTitle>
                    </CardHeader>
                    <CardContent id="receiptTextContent">
                        <table>
                            <tr>
                                <th>MERCHANT</th>
                                {receipt && (
                                    <td>{receipt.name}</td>
                                )}
                            </tr>
                            <tr>
                                <th>AMOUNT</th>
                                {receipt && (
                                    <td>RM{receipt.receiptAmount}</td>
                                )}
                            </tr>
                            <tr>
                                <th>TRANSACTION DATE</th>
                                {receipt && (
                                    <td>{receipt.transactionDate}</td>
                                )}
                            </tr>
                            <tr>
                                <th>ITEMS</th>
                                {receipt && (
                                    <td>
                                        <ul>
                                            {receipt.items.map((item, index) => (
                                                <li key={item.id}>{index + 1}. {item.itemName} - RM{item.itemPrice}</li>
                                            ))}
                                        </ul>
                                    </td>
                                )}
                            </tr>
                        </table>
                    </CardContent>
                    <CardFooter id="receiptFooter">
                        <h2 id="totalAmount" style={{ textAlign: 'right', fontWeight: '800', fontSize: '23px' }}>TOTAL: RM{receipt.receiptAmount}</h2>
                    </CardFooter>
                </Card>
                <Card className="receiptCard">
                    <CardHeader>
                        <CardTitle id="receiptImageTitle">
                            <p>Receipt Image</p>
                            <DropdownMenu id="receiptDownloadMenu">
                                <DropdownMenuTrigger><FontAwesomeIcon icon={faEllipsis} /></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Download Original Image</DropdownMenuItem>
                                    <DropdownMenuItem>Download Scanned Image</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardTitle>
                    </CardHeader>
                    <CardContent id="receiptImageContainer">
                        <img src={"data:image/png;base64," + receipt.receiptImage} style={{ width: '100%' }}>
                        </img>
                    </CardContent>
                </Card>
            </div >

        </>
    )
}

export default ReceiptDisplay;