import User from '../models/userSchema.js';
import OTP from '../models/otpSchema.js';
import  sendOtp  from '../utils/sendOtp.js';
import bcrypt from 'bcrypt'

// Generate a random 6-digit OTP
const generateOTP = () => {
  return String(Math.floor(1000 + Math.random() * 9000));
};

// Send OTP
export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    
    // Save OTP to database with 5 minutes expiry
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Delete any existing OTP for this user
    await OTP.deleteMany({ userId: user._id });

    // Create new OTP record
    await OTP.create({
      userId: user._id,
      otpCode,
      expiresAt
    });

    // Send OTP to user's email
    await sendOtp(user, otpCode);
    console.log('OTP sent successfully to:', user.email);
    
    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Error in sendOTP:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message
    });
  }
};

// Verify OTP and change password
export const verifyOTPAndChangePassword = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      userId: user._id,
      otpCode: otp,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }
        const salt = await bcrypt.genSalt(10);
        newPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Error in verifyOTPAndChangePassword:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message
    });
  }
};