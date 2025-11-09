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
import axios from "axios";
import { toast } from "sonner";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setUserAuthenticated } from "../../redux/slices/userSlice";
import { refreshAccessToken } from "../../service/authService";

const ReceiptCamera = () => {
    const dispatch = useDispatch();
    const cameraRef = useRef(null);
    const [uploadMode, setUploadMode] = useState(false);
    const [image, setImage] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [imageTaken, setImageTaken] = useState(false);
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.user);

    const onUploadFile = async () => {
        setIsLoading(true);
        console.log("Upload successful");
        if (imageUpload !== null) {
            const formData = new FormData();
            formData.append("file", imageUpload);
            try {
                await axios.post("http://localhost:8080/api/receipt/addUpload", formData, {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });
                toast.success("Upload Successful");
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    toast.error("Your session has expired. Refreshing token...");
                    try {
                        console.log("Refreshing token...");
                        const token = await refreshAccessToken();
                        console.log("Refreshing token finished ..." + token);
                        if (token !== null) {
                            dispatch(setUserAuthenticated(true));
                            dispatch(setAccessToken(token));
                            console.log("Token refreshed: " + token);
                        } else {
                            dispatch(setUserAuthenticated(false));
                        }
                        if (user.isAuthenticated) {
                            toast.success("Token refreshed. Uploading file again...");
                            try {
                                console.log("token in user:" + token);
                                await axios.post("http://localhost:8080/api/receipt/addUpload", formData, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
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
        } else {
            toast.error("Please select a file to upload");
        }
        setImageTaken(false);
        setUploadMode(false);
        setImageUpload(null);
        setOpen(false);
        setIsLoading(false);
    }

    const captureReceipt = () => {
        const imageSrc = cameraRef.current.getScreenshot();
        setImage(imageSrc);
        setImageTaken(true);
        setOpen(true);
    }

    const onUploadCapturedReceipt = async () => {
        setIsLoading(true);
        const response = await axios.post("http://localhost:8080/api/receipt/addUpload64", {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
            imageData: image
        });
        console.log(response);
        setImageTaken(false);
        setOpen(false)
        toast.success("Image saved successfully");
        setIsLoading(false);
    }

    return (
        <div id="cameraContainer">
            <Webcam id="camera" screenshotFormat="image/jpeg" ref={cameraRef}>
                {() => { return }}
            </Webcam>

            <Dialog open={open} onOpenChange={(open) => {
                if (!open) {
                    setImage(null);
                    setImageTaken(false);
                    setUploadMode(false);
                    setImageUpload(null)
                    setOpen(false);
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
                                <Button onClick={() => { setImageTaken(false); setImage(null); setOpen(false) }}>Retake</Button>
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
            </Dialog>


        </div >
    )
}

export default ReceiptCamera;