import express from 'express';
import { 
    createOrder, 
    getOrdersByPhone, 
    getOrderByNumber, 
    updateOrderStatus,
    getAllOrders,
    cancelOrder
} from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get orders by phone number
router.get('/customer/:phone', getOrdersByPhone);

// Get order by order number
router.get('/order/:orderNumber', getOrderByNumber);

// Cancel order
router.put('/:suborderCode/cancel', cancelOrder);

// Update order status (admin)
router.put('/:orderNumber/status', authenticateToken, (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
}, updateOrderStatus);

// Get all orders (admin)
router.get('/admin/all', authenticateToken, (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    next();
}, getAllOrders);

export default router;
