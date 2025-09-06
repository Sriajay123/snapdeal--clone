
import express from 'express'
import {regin} from '../controllers/userController.js'
let userroute=express()





userroute.post('/register',regin)


export default userroute;