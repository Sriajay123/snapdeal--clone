import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Create the admin user if it doesn't exist
async function createDefaultAdmin() {
    try {
        const adminExists = await mongoose.model('User').findOne({ email: 'admin@snapdeal.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await mongoose.model('User').create({
                name: 'Admin',
                email: 'admin@snapdeal.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'ADMIN',
                isAdmin: true
            });
            console.log('Default admin user created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  dob: { type: Date },

  password: { type: String, required: true }, // compulsory for new users

  role: { type: String, enum: ["CUSTOMER", "ADMIN"], default: "CUSTOMER" },
  isAdmin: { type: Boolean, default: false },

  addresses: [{
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, enum: ['home', 'office', 'other'], default: 'home' }
  }],

  // isEmailVerified: { type: Boolean, default: false },
  // isPhoneVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create default admin after model is defined
createDefaultAdmin();

export default User;