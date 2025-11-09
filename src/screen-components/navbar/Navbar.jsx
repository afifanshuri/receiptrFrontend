// Navbar.jsx
import React from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "../../service/authService";
import { persistor } from "../../redux/store";
import { resetUser } from "../../redux/slices/userSlice";

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

    const onHandleLogOut = async () => {
        dispatch(resetUser());
        await persistor.purge();
        nav("/");
    }

    return (
        <div id="navbarContainer">
            <h1 id="navbarTitle" onClick={() => redirectToMainPage()}>receiptr.</h1>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                        <NavigationMenuContent className="navbarItems">
                            <NavigationMenuLink className="navLink">Receipts Dashboard</NavigationMenuLink>
                            <NavigationMenuLink className="navLink">Receipts Statistics</NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                        <NavigationMenuContent className="navbarItems">
                            {isUserAuthenticated &&
                                <div>
                                    <NavigationMenuLink className="navLink" onClick={() => onHandleLogOut()}>Log Out</NavigationMenuLink>
                                </div>
                            }
                            {
                                !isUserAuthenticated &&
                                <div>
                                    <NavigationMenuLink className="navLink" onClick={() => nav("/login")}>Log In</NavigationMenuLink>
                                    <NavigationMenuLink className="navLink" onClick={() => nav("/register")}>Register</NavigationMenuLink>
                                </div>
                            }
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>

    );
}

export default Navbar;
