import User from '../models/userSchema.js'
import OTP from '../models/otpSchema.js'
import bcrypt from 'bcrypt'
import sendOtp from '../utils/sendOtp.js';
import jwt from 'jsonwebtoken'


export async function checkUser(req, res) {
  try {
    const { email, phone } = req.body;

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (user) {
      // existing user → send OTP
      const otpCode = String(Math.floor(1000 + Math.random() * 9000));
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await OTP.create({ userId: user._id, otpCode, expiresAt });
      await sendOtp(user, otpCode);

      return res.json({ success: true, isNewUser: false, message: "OTP sent" });
    }

    // new user → just tell frontend
    return res.json({ success: true, isNewUser: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export async function registerUser(req, res) {
  try {
    let { name, email, phone, dob, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, phone, dob, password });

    // send OTP after registration
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ userId: user._id, otpCode, expiresAt });
    await sendOtp(user, otpCode);

    res.json({ success: true, message: "Registered successfully. OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export async function verifyOtp(req, res) {

  let {email,phone,otpCode} = req.body;
   
   if(!otpCode){
      return res.status(400).json({message:"enter validation code"})
   }

  try {
    const query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;
    let existingUser = await User.findOne(query)
    if (!existingUser) {
      return res.status(400).json({ message: "invalid user" })
    }
    let otpDb=await OTP.findOne({
        userId:existingUser._id,
        otpCode,
        expiresAt:{$gt:new Date()},
       
    })
    if(!otpDb){
       return res.status(400).json({message:"invalid or expired otp"})
    }
    await OTP.deleteOne({ _id: otpDb._id });

    const token=jwt.sign(
       {id:existingUser._id,role:existingUser.role},
        process.env.JWT_SECRET_KEY,
        {expiresIn:"7d"}
    )

    res.json({ message: "login successfull",
      token,
       user: { name: existingUser.name, email: existingUser.email, phone: existingUser.phone }
       
       
    })

  } catch (error) {
       res.status(500).json({ message: "Server error" });
  }
}