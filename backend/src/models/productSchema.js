import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // Added oldPrice field
  category: { type: String, required: true },
  subcategory: { type: String },
  //  subType: { type: String },  // Added subType field
  brand: { type: String },
  images: [{ type: String }], // Array of image URLs
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  sizes: [{ type: String }], // e.g., ["S", "M", "L", "XL"]
  colors: [{ type: String }], // e.g., ["Red", "Blue", "Black"]
  keyword: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
