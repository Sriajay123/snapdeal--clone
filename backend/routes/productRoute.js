import express from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct, getProductsByCategory, getFilteredProducts } from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct); // Create product
router.get('/', getProducts); // Get all products
router.get('/filter', getFilteredProducts); // Get products with filters (query params)
router.get('/category/:category', getProductsByCategory); // Get products by category
router.get('/category/:category/:subcategory', getProductsByCategory); // Get products by category and subcategory
router.get('/:id', getProduct); // Get single product
router.put('/:id', updateProduct); // Update product
router.delete('/:id', deleteProduct); // Delete product

export default router;
