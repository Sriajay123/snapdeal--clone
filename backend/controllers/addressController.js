import User from '../models/userSchema.js';

// Add a new address
export const addAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Add the new address
        user.addresses.push(addressData);
        await user.save();

        res.json({ 
            success: true, 
            message: 'Address added successfully',
            address: user.addresses[user.addresses.length - 1]
        });

    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all addresses for a user
export const getAddresses = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            addresses: user.addresses
        });

    } catch (error) {
        console.error('Error fetching addresses:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an existing address
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;
        const updatedData = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Find the address index in the array
        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        // Update the address
        user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...updatedData };
        await user.save();

        res.json({
            success: true,
            message: 'Address updated successfully',
            address: user.addresses[addressIndex]
        });

    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an address
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.addressId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Remove the address from the array
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
        await user.save();

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};