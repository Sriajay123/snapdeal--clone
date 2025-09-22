import express from 'express';
import Product from '../models/productSchema.js';
const router = express.Router();

// Get search suggestions
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json([]);
        }

        // Create a case-insensitive regex pattern for the search query
        const searchRegex = new RegExp(q, 'i');

        // Find products matching the search query in name, category, brand, or keyword
        const products = await Product.find(
            {
                $or: [
                    { name: searchRegex },
                    { category: searchRegex },
                    { brand: searchRegex },
                    { keyword: searchRegex }
                ]
            },
            { name: 1, _id: 0 }
        )
        .limit(8)
        .lean();

        // Get unique suggestions
        const suggestions = [...new Set(products.map(product => product.name))];

        res.json(suggestions);
    } catch (error) {
        console.error('Error in search suggestions:', error);
        res.status(500).json([]);
    }
});

export default router;