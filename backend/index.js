import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'



import userroute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import orderRoute from './routes/orderRoute.js'

import dbConfig from './config/dbConfig.js'

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

app.use('/user',userroute)
app.use('/product', productRoute)
app.use('/orders', orderRoute)



app.listen(port,()=>console.log(`server started in ${port}`))