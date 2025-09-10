import { BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import ProductDescription from "./pages/ProductDescription"

function App() {


  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Home/>} ></Route>
          <Route path="/product/:keyword/:id" element={<ProductDescription/>} ></Route>
      </Routes>
      
    </BrowserRouter>
  )
}

export default App