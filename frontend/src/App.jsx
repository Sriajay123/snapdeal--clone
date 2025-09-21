import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import MyOrders from "./pages/MyOrders"
import OrderDetails from "./pages/OrderDetails"
import SearchResults from "./pages/SearchResults"

import ProtectedRoute from "./components/ProtectedRoute"
import CancelOrder from "./pages/CancelOrder"
import CategoryPage from "./pages/CategoryPage"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="/product/:keyword/:id" element={<ProductDescription className='bg-[#f7f7f7]'/>} />
        {/* Dynamic Category Routes */}
        <Route path="/products/:category" element={<CategoryPage />} />
        <Route path="/products/:category/:subcategory" element={<CategoryPage />} />
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
        <Route path="/search" element={<SearchResults />} />
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