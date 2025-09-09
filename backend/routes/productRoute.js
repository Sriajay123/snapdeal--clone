import express from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct); // Create product
router.get('/', getProducts); // Get all products
router.get('/:id', getProduct); // Get single product
router.put('/:id', updateProduct); // Update product
router.delete('/:id', deleteProduct); // Delete product

export default router;
