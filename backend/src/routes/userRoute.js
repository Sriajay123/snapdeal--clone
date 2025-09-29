
import express from 'express'
import {checkUser, registerUser, verifyOtp, adminLogin} from '../controllers/userController.js'

let userroute=express.Router()




userroute.post('/register',registerUser)
userroute.post('/login',checkUser)

userroute.post('/verifyotp',verifyOtp)
userroute.post('/admin/login', adminLogin)

export default userroute;