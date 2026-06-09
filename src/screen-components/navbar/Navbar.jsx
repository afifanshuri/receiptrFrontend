// Navbar.jsx
import React from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken, onHandleLogOut } from "../../service/authService";
import { persistor } from "../../redux/store";
import { resetUser } from "../../redux/slices/userSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../../components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faList } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
    const nav = useNavigate();
    const dispatch = useDispatch();
    const isUserAuthenticated = useSelector((state) => state.user.isAuthenticated === true);

    const redirectToMainPage = () => {
        if (isUserAuthenticated) {
            nav("/home");
        } else {
            refreshAccessToken().then((response) => {
                if (response !== null) {
                    nav("/home");
                } else {
                    nav("/");
                }
            });
        }
    }

    const onLogout = async () => {
        try {
            await onHandleLogOut();
            dispatch(resetUser());
            await persistor.purge();
            nav("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            dispatch(resetUser());
            await persistor.purge();
            nav("/", { replace: true });
        }
    };

    return (
        <div id="navbarContainer">
            <h1 className="clickableButton" id="navbarTitle" onClick={() => redirectToMainPage()}>receiptr.</h1>
            <div id="navbarButtonsContainer">
                {!isUserAuthenticated && (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="clickableButton"><FontAwesomeIcon icon={faList} /> Features</DropdownMenuTrigger>
                        <DropdownMenuContent className="navbarItems">
                            <DropdownMenuItem className="navLink clickableButton" onClick={() => nav("/home")}>Receipts Dashboard</DropdownMenuItem>
                            <DropdownMenuItem className="navLink clickableButton" onClick={() => nav("/statistics")}>Receipts Statistics</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>)}

                <DropdownMenu>
                    <DropdownMenuTrigger className="clickableButton"><FontAwesomeIcon icon={faCircleUser} /> Account</DropdownMenuTrigger>
                    {!isUserAuthenticated ? (
                        <DropdownMenuContent className="navbarItems">
                            <DropdownMenuItem className="navLink clickableButton" onClick={() => nav("/login")}>Login</DropdownMenuItem>
                            <DropdownMenuItem className="navLink clickableButton" onClick={() => nav("/register")}>Register</DropdownMenuItem>
                        </DropdownMenuContent>
                    ) : (
                        <DropdownMenuContent className="navbarItems">
                            <DropdownMenuItem className="navLink clickableButton" onClick={() => onLogout()}>Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
            </div>
        </div >
    );
}

export default Navbar;
