import React from "react";
import { Routes, Route } from "react-router-dom";
import MainScreen from "../screen/MainScreen";
import ReceiptDashboard from "../screen/ReceiptDashboard";
import ReceiptDisplay from "../screen-components/receiptDisplay/ReceiptDisplay";
import ReceiptCamera from "../screen-components/receiptCamera/ReceiptCamera";
import ReceiptScanner from "../screen/ReceiptScanner";
import LoginScreen from "../screen/LoginScreen";
import LandingPage from "../screen/LandingPage";
import RegisterScreen from "../screen/RegisterScreen";
import { useSelector } from "react-redux";

const AppRoutes = () => {
    const isUserAuthenticated = useSelector((state) => state.user.isAuthenticated === true);
    return (
        <Routes>
            <Route path="/" element={isUserAuthenticated ? <MainScreen /> : <LandingPage />} />
            <Route path="/home" element={isUserAuthenticated ? <MainScreen /> : <LandingPage />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/dashboard" element={<ReceiptDashboard />} />
            <Route path="/receipt/:id" element={<ReceiptDisplay />} />
            <Route path="/scan" element={<ReceiptCamera />} />
        </Routes>
    );
}
export default AppRoutes;