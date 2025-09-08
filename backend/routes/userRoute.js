
import express from 'express'
import {checkUser,registerUser,verifyOtp} from '../controllers/userController.js'

let userroute=express.Router()





userroute.post('/register',registerUser)
userroute.post('/login',checkUser)

userroute.post('/verifyotp',verifyOtp)


export default userroute;