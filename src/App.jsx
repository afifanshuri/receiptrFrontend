import { Button } from "@/components/ui/button"
import MainScreen from "./screen/MainScreen"
import "./App.css"
import ReceiptDashboard from "./screen/ReceiptDashboard"
import Navbar from "./screen-components/navbar/Navbar"
import ReceiptDisplay from "./screen-components/receiptDisplay/ReceiptDisplay"
import AppRoutes from "./routes/AppRoutes"
import axios from "axios"
import { Toaster } from "sonner"
import { Provider } from "react-redux"
import store, { persistor } from "./redux/store"
import { PersistGate } from "redux-persist/integration/react"

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          <AppRoutes />
          <Toaster richColors position="bottom-right" />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App