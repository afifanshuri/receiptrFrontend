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
import { useSelector } from "react-redux";
import { fetchReceiptsByYear, fetchYearsList } from "../../service/receiptService";
import { toast } from "sonner";

const ReceiptTable = () => {

    const [receiptList, setReceiptList] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [years, setYears] = useState([]);
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchYears() {
            try {
                const yearsData = await fetchYearsList();
                setYears(yearsData);
            } catch (error) {
                toast.error("An Error occurred while fetching years" + error);

            }
        }
        fetchYears();

        if (selectedYear === '') {
            return;
        }
        async function fetchReceipts() {
            try {
                const response = await fetchReceiptsByYear(selectedYear, user);
                setReceiptList(response);
                console.log(receiptList);
            } catch (error) {
                toast.error("An Error occurred during upload after token refresh" + error);
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
                    {years.map((year, index) => {
                        return <DropdownMenuItem key={index} className="clickableButton" onClick={() => setSelectedYear(year)}>{year}</DropdownMenuItem>
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <Table className="receiptTable">
                <TableHeader>
                    <TableRow>
                        <TableHead className="tableHead">Invoice</TableHead>
                        <TableHead className="tableHead">Date Of Transaction</TableHead>
                        <TableHead className="tableHead">
                            <DropdownMenu id="optionsButton" className="tableCell clickableButton">
                                <DropdownMenuTrigger><FontAwesomeIcon icon={faEllipsis} /></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem>Download All Receipts</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableHead>

                    </TableRow>
                </TableHeader>

                <TableBody>
                    {receiptList.map((receipt, index) => (
                        <TableRow key={index}>
                            <TableCell className="tableCell">{receipt.name}</TableCell>
                            <TableCell className="tableCell">{receipt.transactionDate}</TableCell>
                            <TableCell className="tableCell"><Button id="viewButton" onClick={() => onViewReceipt(receipt)}>View</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
export default ReceiptTable;