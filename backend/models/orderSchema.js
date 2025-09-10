import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String
        }
    },
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        addressLine1: {
            type: String,
            required: true
        },
        addressLine2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        phone: {
            type: String
        }
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productDetails: {
            name: String,
            brand: String,
            price: Number,
            image: String,
            selectedSize: String,
            selectedColor: String
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    orderSummary: {
        subtotal: {
            type: Number,
            required: true
        },
        deliveryCharges: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            required: true
        }
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['cod', 'card', 'upi', 'netbanking'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paymentDate: Date
    },
    orderStatus: {
        type: String,
        enum: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
        default: 'placed'
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        message: String
    }],
    estimatedDelivery: Date,
    actualDelivery: Date,
    notes: String
}, {
    timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        const timestamp = Date.now().toString();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `SD${timestamp.slice(-6)}${random}`;
    }
    next();
});

// Add initial status to history
orderSchema.pre('save', function(next) {
    if (this.isNew) {
        this.statusHistory.push({
            status: this.orderStatus,
            message: 'Order placed successfully'
        });
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
