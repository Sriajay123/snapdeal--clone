import mongoose from 'mongoose';
import Product from './models/productSchema.js';
import { config } from 'dotenv';

config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  // SHIRTS
  {
    name: "Men's Cotton Formal Shirt - White",
    description: "Premium quality cotton formal shirt perfect for office wear",
    price: 1299,
    category: "Men's Fashion", 
    subcategory: "Shirts",
    brand: "Raymond",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=300&fit=crop"],
    stock: 50,
    rating: 4.2,
    numReviews: 45,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White"],
    keyword: "mens-formal-white-shirt-raymond"
  },
  {
    name: "Men's Casual Checked Shirt - Blue",
    description: "Comfortable checked casual shirt for everyday wear",
    price: 899,
    category: "Men's Fashion",
    subcategory: "Shirts", 
    brand: "Peter England",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=300&fit=crop"],
    stock: 35,
    rating: 4.0,
    numReviews: 32,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red"],
    keyword: "mens-casual-checked-shirt-peter-england"
  },
  {
    name: "Men's Denim Shirt - Light Blue",
    description: "Trendy denim shirt for casual occasions",
    price: 1599,
    category: "Men's Fashion",
    subcategory: "Shirts",
    brand: "Levi's", 
    images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop"],
    stock: 25,
    rating: 4.5,
    numReviews: 67,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue", "Dark Blue"],
    keyword: "mens-denim-shirt-levis"
  },
  {
    name: "Men's Striped Business Shirt",
    description: "Professional striped shirt for business meetings",
    price: 1149,
    category: "Men's Fashion",
    subcategory: "Shirts",
    brand: "Van Heusen",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop"],
    stock: 40,
    rating: 4.3,
    numReviews: 28,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Blue", "Grey"],
    keyword: "mens-striped-business-shirt-van-heusen"
  },

  // T-SHIRTS  
  {
    name: "Men's Round Neck Cotton T-Shirt - Navy",
    description: "Comfortable cotton t-shirt for daily wear",
    price: 399,
    category: "Men's Fashion",
    subcategory: "T-Shirts",
    brand: "Nike",
    images: ["https://images.unsplash.com/photo-1583743814966-8936f37f421b?w=300&h=300&fit=crop"],
    stock: 60,
    rating: 4.4,
    numReviews: 89,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black", "White"],
    keyword: "mens-round-neck-tshirt-nike"
  },
  {
    name: "Men's Polo T-Shirt - White",
    description: "Classic polo t-shirt with collar",
    price: 799,
    category: "Men's Fashion", 
    subcategory: "T-Shirts",
    brand: "Puma",
    images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=300&fit=crop"],
    stock: 45,
    rating: 4.1,
    numReviews: 56,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Red"],
    keyword: "mens-polo-tshirt-puma"
  },
  {
    name: "Men's V-Neck T-Shirt - Black",
    description: "Stylish v-neck t-shirt for casual wear",
    price: 349,
    category: "Men's Fashion",
    subcategory: "T-Shirts", 
    brand: "Adidas",
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=300&h=300&fit=crop"],
    stock: 55,
    rating: 4.2,
    numReviews: 72,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    keyword: "mens-vneck-tshirt-adidas"
  },
  {
    name: "Men's Graphic Print T-Shirt",
    description: "Trendy graphic print t-shirt",
    price: 599,
    category: "Men's Fashion",
    subcategory: "T-Shirts",
    brand: "H&M",
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop"],
    stock: 30,
    rating: 3.9,
    numReviews: 41,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi"],
    keyword: "mens-graphic-tshirt-hm"
  },

  // JEANS
  {
    name: "Men's Slim Fit Jeans - Dark Blue",
    description: "Premium slim fit jeans with perfect stretch",
    price: 1299,
    category: "Men's Fashion",
    subcategory: "Jeans",
    brand: "Levi's",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=300&fit=crop"],
    stock: 40,
    rating: 4.6,
    numReviews: 124,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Dark Blue"],
    keyword: "mens-slim-fit-jeans-levis"
  },
  {
    name: "Men's Regular Fit Jeans - Light Blue", 
    description: "Comfortable regular fit jeans for everyday wear",
    price: 999,
    category: "Men's Fashion",
    subcategory: "Jeans",
    brand: "Wrangler",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop"],
    stock: 35,
    rating: 4.2,
    numReviews: 87,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Light Blue"],
    keyword: "mens-regular-fit-jeans-wrangler"
  },
  {
    name: "Men's Skinny Fit Black Jeans",
    description: "Modern skinny fit jeans in classic black",
    price: 1149,
    category: "Men's Fashion",
    subcategory: "Jeans",
    brand: "Diesel",
    images: ["https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=300&h=300&fit=crop"],
    stock: 25,
    rating: 4.4,
    numReviews: 63,
    sizes: ["28", "30", "32", "34"],
    colors: ["Black"],
    keyword: "mens-skinny-fit-jeans-diesel"
  },
  {
    name: "Men's Straight Fit Blue Jeans",
    description: "Classic straight fit jeans in medium blue",
    price: 899,
    category: "Men's Fashion", 
    subcategory: "Jeans",
    brand: "Lee",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop"],
    stock: 50,
    rating: 4.1,
    numReviews: 95,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue"],
    keyword: "mens-straight-fit-jeans-lee"
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products (optional)
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    // Insert new products
    console.log('Adding sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    
    console.log(`Successfully added ${insertedProducts.length} products to the database`);
    console.log('Products added:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.subcategory})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();