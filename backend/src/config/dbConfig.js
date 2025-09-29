import mongoose  from "mongoose";

let configDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default configDb;