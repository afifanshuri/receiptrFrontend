import React from "react";
import ReceiptCamera from "../screen-components/receiptCamera/ReceiptCamera";
import { Button } from "../components/ui/button";
import '../styles/ReceiptScannerStyle.css'

const ReceiptScanner = () => {
    return (
        <ReceiptCamera id="scannerContainer" />
    )
}

export default ReceiptScanner;
