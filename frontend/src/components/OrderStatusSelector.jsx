import React from 'react';
import api from '../api/api';

const OrderStatusSelector = ({ currentStatus, orderId, onStatusUpdate }) => {
    const statusOptions = [
        { value: 'placed', label: 'Placed', color: 'gray' },
        { value: 'confirmed', label: 'Confirmed', color: 'blue' },
        { value: 'packed', label: 'Packed', color: 'yellow' },
        { value: 'shipped', label: 'Shipped', color: 'indigo' },
        { value: 'out_for_delivery', label: 'Out for Delivery', color: 'purple' },
        { value: 'delivered', label: 'Delivered', color: 'green' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' }
    ];

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption ? statusOption.color : 'gray';
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            onStatusUpdate(newStatus);
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <select
            value={currentStatus}
            onChange={handleStatusChange}
            className={`border rounded px-2 py-1 text-sm font-medium bg-${getStatusColor(currentStatus)}-100 text-${getStatusColor(currentStatus)}-800 border-${getStatusColor(currentStatus)}-200`}
        >
            {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default OrderStatusSelector;