import Order from '../models/orderSchema.js';
import Product from '../models/productSchema.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        console.log("Received order creation request:", req.body);
        
        const {
            customerInfo,
            shippingAddress,
            items,
            orderSummary,
            paymentInfo
        } = req.body;

        // Validate items and get product details
        const validatedItems = await Promise.all(
            items.map(async (item) => {
                const productId = item.product || item.productId; // Support both formats
                const product = await Product.findById(productId);
                if (!product) {
                    throw new Error(`Product not found: ${productId}`);
                }

                // Use frontend product details if provided, otherwise get from database
                const productDetails = item.productDetails || {
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    image: product.images && product.images.length > 0 ? product.images[0] : '',
                    selectedSize: item.selectedSize || '',
                    selectedColor: item.selectedColor || ''
                };

                return {
                    product: product._id,
                    productDetails,
                    quantity: item.quantity,
                    price: item.price || (product.price * item.quantity)
                };
            })
        );

        // Generate unique order number
        const generateOrderNumber = () => {
            const timestamp = Date.now().toString();
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `SD${timestamp.slice(-8)}${random}`;
        };

        // Create order
        const order = new Order({
            orderNumber: generateOrderNumber(),
            customerInfo,
            shippingAddress,
            items: validatedItems,
            orderSummary,
            paymentInfo: {
                ...paymentInfo,
                status: paymentInfo.method === 'cod' ? 'pending' : 'completed',
                paymentDate: paymentInfo.method !== 'cod' ? new Date() : null
            }
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: order
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create order'
        });
    }
};

// Get all orders for a customer (by phone number)
export const getOrdersByPhone = async (req, res) => {
    try {
        const { phone } = req.params;
        
        const orders = await Order.find({
            'customerInfo.phone': phone
        })
        .populate('items.product')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

// Get order by order number
export const getOrderByNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        const order = await Order.findOne({ orderNumber })
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
};

// Update order status (for admin)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const { status, message } = req.body;
        
        const order = await Order.findOne({ orderNumber });
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update status
        order.orderStatus = status;
        
        // Add to status history
        order.statusHistory.push({
            status: status,
            message: message || `Order status updated to ${status}`
        });

        // Set delivery date if delivered
        if (status === 'delivered' && !order.actualDelivery) {
            order.actualDelivery = new Date();
        }

        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order: order
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status'
        });
    }
};

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('items.product')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments();

        res.json({
            success: true,
            orders: orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders: totalOrders
            }
        });

    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};
