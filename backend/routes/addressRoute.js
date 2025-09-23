import express from 'express';
import { 
    addAddress, 
    getAddresses, 
    updateAddress, 
    deleteAddress 
} from '../controllers/addressController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected - only logged in users can access
router.get('/', auth, getAddresses);           // Get all addresses
router.post('/', auth, addAddress);            // Add a new address
router.put('/:addressId', auth, updateAddress); // Update an existing address
router.delete('/:addressId', auth, deleteAddress); // Delete an address

export default router;