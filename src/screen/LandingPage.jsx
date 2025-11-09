import React from "react";
import '../styles/LandingPageStyle.css'
import graphic2 from "../assets/images/main_graphic3.png";
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

const LandingPage = () => {
    const OPTIONS = { loop: true };
    const SLIDES = [
        { id: 1, img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f&auto=format&fit=crop&w=1470&q=80" },
        { id: 2, img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f&auto=format&fit=crop&w=1470&q=80" }
    ];
    return (
        <div>
            <div id="mainContainer">
                <div id="titleContainer">
                    <h1>Smart, secure, and effortless receipt management.</h1>
                    <h3>Just simply snap and store. All your tax documents in one place.</h3>
                </div>
                <div id="graphicContainer">
                    {/*<AutoCarousel slides={SLIDES} options={OPTIONS} />*/}
                    <img src={graphic2}></img>
                </div>
            </div>
        </div>
    )
};

export default LandingPage;
