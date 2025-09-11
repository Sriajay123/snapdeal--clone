import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import MyOrders from "./pages/MyOrders"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/product/:keyword/:id" element={<ProductDescription/>} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrders/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App