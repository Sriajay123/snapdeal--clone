import express from 'express'
import userroute from './routes/userRoute.js'
import dotenv from 'dotenv'
import dbConfig from './config/dbConfig.js'
const app=express()
app.use(express.json())
dotenv.config()
dbConfig()
const port=process.env.PORT
app.use('/user',userroute)




app.listen(port,()=>console.log(`server started in ${port}`))