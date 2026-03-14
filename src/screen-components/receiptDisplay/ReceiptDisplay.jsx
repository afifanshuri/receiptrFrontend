import React, { use, useEffect, useState } from "react";
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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"
import { BadgeCheck } from "lucide-react"

import "./ReceiptDisplay.css"
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { refreshAccessToken } from "../../service/authService";
import { setAccessToken, setUserAuthenticated } from "../../redux/slices/userSlice";
import { Button } from "../../components/ui/button";

const ReceiptDisplay = () => {
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isShowReceiptImage, setIsShowReceiptImage] = useState(false);
    const [isShowEditReceipt, setIsShowEditReceipt] = useState(false);
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

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "data:image/png;base64," + receipt.receiptImage;
        link.download = `receipt_${receipt.id || Date.now()}.png`;
        link.click();
    };

    if (loading) {
        return <div>
            <PropagateLoader loading={loading} />
        </div>;
    }

    return (
        <>
            <h1>Receipt Display</h1>
            <Card className="receiptCard">
                <CardHeader id="receiptCardHeader">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CardTitle id="receiptTitle">INVOICE #{receipt.id}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"><BadgeCheck data-icon="inline-start" />Tax Claimable</Badge>
                    </div>
                    <DropdownMenu id="receiptDownloadMenu">
                        <DropdownMenuTrigger className="clickableButton"><FontAwesomeIcon icon={faEllipsis} /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="clickableButton" onClick={() => setIsShowReceiptImage(true)}>
                                Show Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem className="clickableButton" onClick={() => setIsShowEditReceipt(true)}>
                                Edit Receipt Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent id="receiptCardContent">
                    <table>
                        <tbody>
                            <tr>
                                <th>Merchant</th>
                                <td>{!isShowEditReceipt
                                    ? receipt.name
                                    : <Input value={receipt.name} style={{ width: 'auto', minWidth: `${receipt.name.length * 8}px` }} />}
                                </td>
                            </tr>
                            <tr>
                                <th>Amount</th>
                                <td>{!isShowEditReceipt
                                    ? `RM${receipt.receiptAmount}`
                                    : <Input value={receipt.receiptAmount} style={{ width: 'auto', minWidth: `${receipt.receiptAmount.toString().length * 8}px` }} />}
                                </td>
                            </tr>
                            <tr>
                                <th>Transaction Date</th>
                                <td>{!isShowEditReceipt
                                    ? receipt.transactionDate
                                    : <Input value={receipt.transactionDate} style={{ width: 'auto', minWidth: `${receipt.transactionDate.length * 8}px` }} />}
                                </td>
                            </tr>
                            <tr>
                                <th>Items</th>
                                <td>
                                    <ul>
                                        {receipt.items.map((item, index) => {
                                            const itemText = `${index + 1}. ${item.itemName} - RM${item.itemPrice}`;
                                            return (
                                                <li key={item.id}>
                                                    {!isShowEditReceipt
                                                        ? itemText
                                                        : <Input value={itemText} style={{ width: 'auto', minWidth: `${itemText.length * 8}px` }} />}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <th>Additional Information</th>
                                <td>
                                    <ul>
                                        {receipt.items.map((item, index) => {
                                            const itemText = `${index + 1}. ${item.itemDescription}`;
                                            return (
                                                <li key={item.id}>
                                                    {!isShowEditReceipt
                                                        ? `${index + 1}. ${item.itemDescription}`
                                                        : <Input value={itemText} style={{ width: 'auto', minWidth: `${`${index + 1}. ${item.itemDescription}`.length * 8}px`, maxWidth: '100%' }} />}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
                <CardFooter id="receiptCardFooter">
                    {!isShowEditReceipt ? (
                        <h2 id="totalAmount" style={{ textAlign: 'right', fontWeight: '800', fontSize: '23px' }}>Total: RM{receipt.receiptAmount}</h2>
                    ) : <><h2>Total</h2> <Input value={receipt.receiptAmount}></Input></>}

                </CardFooter>
                {isShowEditReceipt && (<Button className="clickableButton" onClick={() => setIsShowEditReceipt(false)}>
                    Save Changes
                </Button>
                )
                }
            </Card>
            {
                isShowReceiptImage && (
                    <Dialog open={isShowReceiptImage} onOpenChange={setIsShowReceiptImage}>
                        <DialogContent>
                            <img id="receiptImageDialog" src={"data:image/png;base64," + receipt.receiptImage}>
                            </img>
                            <Button className="clickableButton" onClick={handleDownload}>
                                <FontAwesomeIcon icon={faDownload} /> Download Receipt Image
                            </Button>
                        </DialogContent>
                    </Dialog>)
            }
        </>
    )
}

export default ReceiptDisplay;