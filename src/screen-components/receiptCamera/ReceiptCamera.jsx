import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./ReceiptCamera.css"
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { PropagateLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { addUploadedReceipt, addUploadedReceipt64 } from "../../service/receiptService";
import ReceiptDisplay from "../receiptDisplay/ReceiptDisplay";

const ReceiptCamera = () => {
    const cameraRef = useRef(null);
    const [uploadMode, setUploadMode] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [imageTaken, setImageTaken] = useState(false);
    const [open, setOpen] = useState(false);
    const [receiptId, setReceiptId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const resetState = () => {
        setImageTaken(false);
        setUploadMode(false);
        setImageUpload(null);
        setIsLoading(false);
        setReceiptId(null);
        setOpen(false);
    }

    const captureReceipt = () => {
        const imageSrc = cameraRef.current.getScreenshot();
        setImage(imageSrc);
        setImageTaken(true);
        setOpen(true);
    }

    const onUploadFile = async () => {
        setIsLoading(true);
        if (imageUpload !== null) {
            const formData = new FormData();
            formData.append("file", imageUpload);
            try {
                console.log("Attempting to upload file");
                const response = await addUploadedReceipt(formData, user);
                setImageTaken(true);
                setReceiptId(response.id);
            } catch (error) {
                toast.error("An Error occurred during upload after token refresh" + error);
            }
        } else {
            toast.error("Please select a file to upload");
        }
        setIsLoading(false);
    }

    const onUploadCapturedReceipt = async () => {
        const response = await addUploadedReceipt64(image, user);
        setIsLoading(true);
        setReceiptId(response.id);
        setIsLoading(false);
    }

    return (
        <div id="cameraContainer">
            <Webcam id="camera" screenshotFormat="image/jpeg" ref={cameraRef}>
                {() => { return }}
            </Webcam>

            <Dialog open={open} onOpenChange={(open) => {
                if (!open) {
                    resetState();
                }
            }}>
                <div id="dialogContainer">
                    <DialogTrigger className="capture-button" asChild>
                        <Button onClick={() => captureReceipt()}>Capture Receipt</Button>
                    </DialogTrigger>
                    <DialogTrigger className="capture-button" asChild>
                        <Button onClick={() => { setUploadMode(true); setOpen(true) }} >Upload Receipt</Button>
                    </DialogTrigger>
                </div>

                {!isLoading && imageTaken && (
                    <DialogContent>
                        <DialogDescription id="cameraDialogContainer">
                            <img src={image} alt="Captured Receipt" />
                            <div id="buttonContainer">
                                <Button onClick={() => { resetState() }}>Retake</Button>
                                <Button onClick={() => { onUploadCapturedReceipt() }}>Save</Button>
                            </div>
                        </DialogDescription>
                    </DialogContent>
                )}

                {!isLoading && uploadMode && (
                    <DialogContent>
                        <DialogDescription id="buttonContainer">
                            <Button><input type="file" id="fileInput" accept="image/*" multiple onChange={(e) => { setImageUpload(e.target.files[0]) }}></input><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></Button>
                            <Button onClick={() => onUploadFile()}>Submit Upload</Button>
                        </DialogDescription>
                    </DialogContent>
                )}

                {isLoading && (
                    <DialogContent id="loadingContainer" className="[&>button]:hidden">
                        Analyzing Your Receipt
                        <PropagateLoader loading={isLoading} />
                    </DialogContent>
                )}

                {!isLoading && (imageTaken || imageUpload) && receiptId
                    && (
                        <DialogContent id="loadingContainer">
                            <ReceiptDisplay id={receiptId} />
                            <Button onClick={() => { resetState() }}>Close</Button>
                        </DialogContent>
                    )
                }

            </Dialog>


        </div >
    )
}

export default ReceiptCamera;