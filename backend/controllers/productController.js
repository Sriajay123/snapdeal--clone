import Product from '../models/productSchema.js';
import mongoose from 'mongoose';

// Create a product
export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get all products
export async function getProducts(req, res) {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get products by category
export async function getProductsByCategory(req, res) {
  try {
    let { category, subcategory } = req.params;
    let { 
      minPrice, 
      maxPrice, 
      color, 
      brand, 
      size,
      minRating,
      minDiscount,
      maxDiscount,
      fabric,
      sleevelength,
      sort 
    } = req.query;
    
    let filter = {};

    // Basic category filters
    if (category) {
      filter.category = category;
    }
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Color filter
    if (color) {
      filter.colors = { $in: color.split(',') };
    }

    // Brand filter
    if (brand) {
      filter.brand = { $in: brand.split(',') };
    }

    // Size filter
    if (size) {
      filter.size = { $in: size.split(',') };
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    // Discount filter
    if (minDiscount || maxDiscount) {
      filter.$expr = {
        $and: [
          { $gt: ['$oldPrice', '$price'] }, // Only include products with a discount
          {
            $let: {
              vars: {
                discountPercentage: {
                  $multiply: [
                    { $divide: [{ $subtract: ['$oldPrice', '$price'] }, '$oldPrice'] },
                    100
                  ]
                }
              },
              in: {
                $and: [
                  minDiscount ? { $gte: ['$$discountPercentage', Number(minDiscount)] } : true,
                  maxDiscount ? { $lte: ['$$discountPercentage', Number(maxDiscount)] } : true
                ]
              }
            }
          }
        ]
      };
    }

    // Fabric filter
    if (fabric) {
      filter.fabric = { $in: fabric.split(',') };
    }

    // Sleeve length filter
    if (sleevelength) {
      filter.sleevelength = { $in: sleevelength.split(',') };
    }

    console.log('Filter being applied:', filter); // Debug log

    let query = Product.find(filter);

    // Apply sorting
    if (sort) {
      switch(sort) {
        case 'price_low':
          query = query.sort({ price: 1 });
          break;
        case 'price_high':
          query = query.sort({ price: -1 });
          break;
        case 'rating':
          query = query.sort({ rating: -1 });
          break;
        case 'newest':
          query = query.sort({ createdAt: -1 });
          break;
        default:
          query = query.sort({ createdAt: -1 }); // Default to newest
      }
    }

    const products = await query;
    console.log('Products found:', products.length); // Debug log
    res.json({ success: true, products, count: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get products with query filters
export async function getFilteredProducts(req, res) {
  try {
    const { category, subcategory, minPrice, maxPrice, brand, sort } = req.query;
    
    let filter = {};
    
    // Category filter
    if (category) {
      filter.category = new RegExp(category, 'i');
    }
    
    // Subcategory filter  
    if (subcategory) {
      filter.subcategory = new RegExp(subcategory, 'i');
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    
    // Brand filter
    if (brand) {
      filter.brand = new RegExp(brand, 'i');
    }
    
    let query = Product.find(filter);
    
    // Sorting
    if (sort) {
      switch(sort) {
        case 'price_low':
          query = query.sort({ price: 1 });
          break;
        case 'price_high':
          query = query.sort({ price: -1 });
          break;
        case 'rating':
          query = query.sort({ rating: -1 });
          break;
        case 'newest':
          query = query.sort({ createdAt: -1 });
          break;
        default:
          query = query.sort({ createdAt: -1 }); // Default to newest
      }
    }
    
    const products = await query;
    res.json({ success: true, products, count: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Get single product
export async function getProduct(req, res) {
  try {
    let product;
    const { id } = req.params;

    // Try to find by ID first
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        product = await Product.findById(id);
      }
    } catch (error) {
      console.log('Error finding by ID:', error);
    }

    // If not found by ID, try finding by keyword
    if (!product) {
      product = await Product.findOne({ keyword: id });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error('Error in getProduct:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

// Update product
export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Delete product
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// Search products
export async function searchProducts(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Create a search regex that is case insensitive
    const searchRegex = new RegExp(q, 'i');

    // Search in name, description, brand, category, and subcategory
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
      ]
    });

    res.json({ 
      success: true, 
      products,
      count: products.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
