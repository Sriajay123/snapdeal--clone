import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import MyOrders from "./pages/MyOrders"
import OrderDetails from "./pages/OrderDetails"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/product/:keyword/:id" element={<ProductDescription className='bg-[#f7f7f7]'/>} />
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/my-orders" element={
          <ProtectedRoute>
            <MyOrders/>
          </ProtectedRoute>
        } />
        <Route path="/order-details/:orderNumber" element={
          <ProtectedRoute>
            <OrderDetails/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App