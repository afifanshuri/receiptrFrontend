import { Button } from "@/components/ui/button"
import MainScreen from "./screen/MainScreen"
import "./App.css"
import ReceiptDashboard from "./screen/ReceiptDashboard"
import Navbar from "./screen-components/navbar/Navbar"
import ReceiptDisplay from "./screen-components/receiptDisplay/ReceiptDisplay"
import AppRoutes from "./routes/AppRoutes"
import { Toaster } from "sonner"
import { Provider, useDispatch } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { useEffect, useState } from "react"
import { refreshAccessToken } from "./service/authService"
import { Spinner } from "@/components/ui/spinner"
import { setUserAuthenticated, setUserNotAuthenticated } from "./redux/slices/userSlice"

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await refreshAccessToken();
        if (token) {
          dispatch(setUserAuthenticated(token));
        } else {
          dispatch(setUserNotAuthenticated());
        }
      } catch (err) {
        dispatch(setUserNotAuthenticated());
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center" }}><Spinner /> Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <AppRoutes />
      <Toaster richColors position="bottom-right" />
    </>
  )
}

export default App