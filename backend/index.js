import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'



import userroute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import reviewRoute from './routes/reviewRoute.js'

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

app.use('/user',userroute)
app.use('/product', productRoute)
app.use('/orders', orderRoute)
app.use('/payment', paymentRoute)
app.use('/reviews', reviewRoute)



app.listen(port,()=>console.log(`server started in ${port}`))