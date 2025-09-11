import express from 'express';
import { 
    createOrder, 
    getOrdersByPhone, 
    getOrderByNumber, 
    updateOrderStatus,
    getAllOrders 
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get orders by phone number
router.get('/customer/:phone', getOrdersByPhone);

// Get order by order number
router.get('/order/:orderNumber', getOrderByNumber);

// Update order status (admin)
router.put('/status/:orderNumber', updateOrderStatus);

// Get all orders (admin)
router.get('/admin/all', getAllOrders);

export default router;
