import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProduct, 
    updateProduct, 
    deleteProduct,
    getProductsByCategory,
    getFilteredProducts,
    searchProducts
} from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct); // Create product
router.get('/', getProducts); // Get all products
// Dynamic routes should come after static routes
router.get('/filter', getFilteredProducts); // Get products with filters (query params)
router.get('/search', searchProducts); // Search products
router.get('/category/:category/:subcategory', getProductsByCategory); // Get products by category and subcategory
router.get('/category/:category', getProductsByCategory); // Get products by category
router.get('/:id', getProduct); // Get single product
router.get('/:subcategory', getProductsByCategory); // Get products by subcategory only
router.put('/:id', updateProduct); // Update product
router.delete('/:id', deleteProduct); // Delete product

export default router;
