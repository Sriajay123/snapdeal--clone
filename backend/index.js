import dotenv from 'dotenv'
dotenv.config()
import express from 'express'

import userroute from './routes/userRoute.js'

import dbConfig from './config/dbConfig.js'

const app=express()
app.use(express.json())

dbConfig()
const port=process.env.PORT
app.use('/user',userroute)




app.listen(port,()=>console.log(`server started in ${port}`))