import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import MyOrders from "./pages/MyOrders"
import OrderDetails from "./pages/OrderDetails"
import MenFashion from "./pages/MenFashion"
import Shirts from "./pages/Shirts"
import TShirts from "./pages/TShirts"
import Jeans from "./pages/Jeans"
import ProtectedRoute from "./components/ProtectedRoute"
import CancelOrder from "./pages/CancelOrder"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/product/:keyword/:id" element={<ProductDescription className='bg-[#f7f7f7]'/>} />
        <Route path="product/mens-fashion" element={<MenFashion/>}>
          <Route index element={<div className="p-4 text-center text-gray-600">Select a category from the sidebar</div>} />
          <Route path="shirts" element={<Shirts/>} />
          <Route path="tshirts" element={<TShirts/>} />
          <Route path="jeans" element={<Jeans/>} />
        </Route>
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
        <Route path="/myorders/cancelOrder/:suborderCode" element={
          <ProtectedRoute>
            <CancelOrder/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App