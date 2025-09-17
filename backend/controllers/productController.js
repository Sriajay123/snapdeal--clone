import Product from '../models/productSchema.js';

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
    const { category, subcategory } = req.params;
    
    let filter = {};
    
    if (category) {
      // Map URL-friendly category names to database categories
      let dbCategory = category;
      if (category.toLowerCase() === 'mens-fashion') {
        dbCategory = "Men's Fashion";
      }
      filter.category = dbCategory; // Exact match instead of regex
    }
    
    if (subcategory) {
      // Map URL-friendly subcategory names to database subcategories
      let dbSubcategory = subcategory;
      if (subcategory.toLowerCase() === 'shirts') {
        dbSubcategory = "Shirts";
      } else if (subcategory.toLowerCase() === 'tshirts') {
        dbSubcategory = "T-Shirts";
      } else if (subcategory.toLowerCase() === 'jeans') {
        dbSubcategory = "Jeans";
      }
      filter.subcategory = dbSubcategory; // Exact match instead of regex
    }
    
    console.log('Filter being applied:', filter); // Debug log
    const products = await Product.find(filter);
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
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
