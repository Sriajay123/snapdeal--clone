import mongoose from 'mongoose'


const otpSchema=new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otpCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },

})

const OTP=mongoose.model("OTP",otpSchema);
export default OTP;