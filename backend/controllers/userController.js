import User from '../models/userSchema.js'
import OTP from '../models/otpSchema.js'
import  bcrypt from 'bcrypt'
import  sendOtp  from '../utils/sendOtp.js';



export async  function regin (req, res){
  try {
    let { name, email, phone, dob, password } = req.body;

    let user = await User.findOne({ $or: [{ email }, { phone }] });

    if (!user) {
      // For new user: require ALL fields
      if (!name || !email || !phone ||!password) {
        return res.status(400).json({ message: "All fields are required for signup" });
      }
      const salt=await bcrypt.genSalt(10)
    password = await bcrypt.hash(password, salt);

      user = await User.create({ name, email, phone, dob, password });
    }


    const otpCode = String(Math.floor(1000 + Math.random() * 9000)); 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ userId: user._id, otpCode, expiresAt });

     await sendOtp(user,otpCode)
    console.log(`OTP for ${user.phone}: ${otpCode}`);

    res.json({
      message: "OTP sent successfully",
      isNewUser: !user.isPhoneVerified && !user.isEmailVerified // frontend can use this
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
