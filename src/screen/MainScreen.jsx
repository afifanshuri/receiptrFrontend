import React from "react";
import '../styles/MainScreenStyle.css'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../components/ui/sheet"
import { Button } from "../components/ui/button"
import AutoCarousel from "../screen-components/autoCarousel/AutoCarousel";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../redux/store";
import { resetUser } from "../redux/slices/userSlice";

const MainScreen = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const OPTIONS = { loop: true };
    const SLIDES = [
        { id: 1, img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f&auto=format&fit=crop&w=1470&q=80" },
        { id: 2, img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f&auto=format&fit=crop&w=1470&q=80" }
    ];

    const navigate = useNavigate();
    return (
        <div id="mainContainer">
            <h1>Welcome, {user.profile.firstName}</h1>
            <div id="buttonContainer">
                <Button onClick={() => navigate("/dashboard")}>List of Receipts</Button>
                <Button onClick={() => { navigate("/scan") }}>Scan A Receipt</Button>
                <Button onClick={() => { dispatch(resetUser()); persistor.purge(); window.location.reload(); navigate("/"); }}>Purge</Button>
            </div>
        </div>
    )
};

export default MainScreen;
