import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import "./ReceiptTable.css"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "../../service/authService";
import { setAccessToken, setUserAuthenticated } from "../../redux/slices/userSlice";
import { toast } from "sonner";

const ReceiptTable = () => {

    const [receiptList, setReceiptList] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedYear === '') {
            return;
        }
        async function fetchReceipts() {
            try {
                const response = await axios.get(`http://localhost:8080/api/receipt/view`, { headers: { Authorization: `Bearer ${user.accessToken}` }, params: { year: selectedYear } });
                setReceiptList(response.data);
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
                                const response = await axios.get(`http://localhost:8080/api/receipt/view`, { headers: { Authorization: `Bearer ${user.accessToken}` }, params: { year: selectedYear } });
                                setReceiptList(response.data);
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
                }
            }
        }
        fetchReceipts();
    }, [selectedYear]);

    const onViewReceipt = (receipt) => {
        navigate(`/receipt/${receipt.id}`);
    }

    return (
        <div id="receiptTableContainer">

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="clickableButton" variant="outline" style={{ margin: '10px' }}>{selectedYear || "Choose A Year"}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem className="clickableButton" onClick={() => setSelectedYear(2021)}>2021</DropdownMenuItem>
                    <DropdownMenuItem className="clickableButton" onClick={() => setSelectedYear(2022)}>2022</DropdownMenuItem>
                    <DropdownMenuItem className="clickableButton" onClick={() => setSelectedYear(2023)}>2023</DropdownMenuItem>
                    <DropdownMenuItem className="clickableButton" onClick={() => setSelectedYear(2024)}>2024</DropdownMenuItem>
                    <DropdownMenuItem className="clickableButton" onClick={() => setSelectedYear(2025)}>2025</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Table className="receiptTable">
                <TableHeader>
                    <TableRow>
                        <TableHead className="tableHead">Invoice</TableHead>
                        <TableHead className="tableHead">Date Of Transaction</TableHead>
                        <DropdownMenu id="optionsButton" className="tableCell clickableButton">
                            <DropdownMenuTrigger><FontAwesomeIcon icon={faEllipsis} /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Download All Receipts</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableRow>

                </TableHeader>
                <TableBody>
                    {receiptList.map((receipt) => (
                        <TableRow>
                            <TableCell className="tableCell">{receipt.name}</TableCell>
                            <TableCell className="tableCell">{receipt.transactionDate}</TableCell>
                            <Button id="viewButton" onClick={() => onViewReceipt(receipt)}>View</Button>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>
        </div>
    );
}
export default ReceiptTable;