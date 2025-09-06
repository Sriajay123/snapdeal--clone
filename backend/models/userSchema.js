import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  dob: { type: Date },

  password: { type: String, required: true }, // compulsory for new users

  role: { type: String, enum: ["CUSTOMER", "ADMIN"], default: "CUSTOMER" },

  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const User= mongoose.model('User',userSchema)
export default User;