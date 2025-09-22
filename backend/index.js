import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'



import userroute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import reviewRoute from './routes/reviewRoute.js'
import searchSuggestionRoute from './routes/searchSuggestionRoute.js'

import dbConfig from './config/dbConfig.js'
import Razorpay from 'razorpay'

const app=express()
app.use(express.json())

app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow both ports
    credentials: true,               // allow sending cookies
  })
);
dbConfig()
const port=process.env.PORT

export const instance=new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

app.use('/api/user',userroute)
app.use('/api/product', productRoute)
app.use('/api/orders', orderRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/reviews', reviewRoute)
app.use('/api/search', searchSuggestionRoute)



app.listen(port,()=>console.log(`server started in ${port}`))