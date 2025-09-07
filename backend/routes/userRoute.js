
import express from 'express'
import {regin,verifyOtp} from '../controllers/userController.js'

let userroute=express.Router()





userroute.post('/register',regin)
userroute.post('/verifyotp',verifyOtp)


export default userroute;