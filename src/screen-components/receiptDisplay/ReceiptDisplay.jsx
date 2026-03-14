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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Badge } from "@/components/ui/badge"
import { BadgeCheck } from "lucide-react"

import "./ReceiptDisplay.css"
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsis, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { refreshAccessToken } from "../../service/authService";
import { setAccessToken, setUserAuthenticated } from "../../redux/slices/userSlice";
import { Button } from "../../components/ui/button";
import { saveReceipt } from "../../service/receiptService";

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

    const onHandleSaveChanges = async (receiptData) => {
        console.log(user);
        const response = await saveReceipt(receiptData, user);
        console.log(response);
        if (response === 200) {
            toast.success("Changes saved successfully!");
        } else {
            toast.error("An error occurred while saving changes.");
        }
        setIsShowEditReceipt(false);
    }

    const onDeleteRow = (type, index) => {
        if (type === 1) {
            receipt.items.splice(index, 1);
        } else if (type === 2) {
            receipt.items.pop();
        }
    }

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
                                    : <Input defaultValue={receipt.name} onChange={(e) => { receipt.name = e.target.value }} />}
                                </td>
                            </tr>
                            <tr>
                                <th>Transaction Date</th>
                                <td>{!isShowEditReceipt
                                    ? receipt.transactionDate
                                    : <Input defaultValue={receipt.transactionDate} onChange={(e) => { receipt.transactionDate = e.target.value }} />}
                                </td>
                            </tr>
                            <tr>
                                <th>Items & Description</th>
                                <td>
                                    <ul>
                                        {receipt.items.map((item, index) => {
                                            const itemText = `${index + 1}. ${item.itemName} - RM${item.itemPrice}`;
                                            return (
                                                <li key={item.id}>
                                                    {!isShowEditReceipt
                                                        ? <div>
                                                            {<div style={{}}>{itemText}</div>}
                                                            {item.itemDescription && <div style={{ marginTop: '7px', marginBottom: '7px', fontWeight: '300', fontSize: '14px' }}>{item.itemDescription}</div>}
                                                        </div>
                                                        :
                                                        <div id="outerEditableItemContainer">
                                                            <div style={{ marginRight: '5px' }}>{index + 1}</div>
                                                            <div id="innerEditableItemContainer">
                                                                <div id="itemNamePriceContainer">
                                                                    <div>
                                                                        <Label>Item Name</Label>
                                                                        <Input defaultValue={item.itemName} onChange={(e) => { item.itemName = e.target.value }} />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Item Price</Label>
                                                                        <Input defaultValue={item.itemPrice} onChange={(e) => { item.itemPrice = e.target.value }} />
                                                                    </div>
                                                                </div>
                                                                <div id="itemDescriptionContainer">
                                                                    <Label>Item Description</Label>
                                                                    <Textarea defaultValue={item.itemDescription} onChange={(e) => { item.itemDescription = e.target.value }} />
                                                                </div>
                                                            </div>
                                                        </div>}
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
                    ) : <div><h2>Total</h2> <Input defaultValue={receipt.receiptAmount} onChange={(e) => { receipt.receiptAmount = e.target.value }}></Input></div>}

                </CardFooter>
                {isShowEditReceipt && (
                    <div id="editReceiptButtons">
                        <Button className="clickableButton" onClick={() => setIsShowEditReceipt(false)} style={{ backgroundColor: "#dc3545", color: "white" }}>
                            Cancel
                        </Button>
                        <Button className="clickableButton" onClick={() => onHandleSaveChanges(receipt)} style={{ backgroundColor: "#007bff", color: "white" }}>
                            Save Changes
                        </Button>
                    </div>
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