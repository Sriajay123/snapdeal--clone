import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/addresses';

export const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const addAddress = async (addressData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}`, addressData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const updateAddress = async (addressId, addressData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}/${addressId}`, addressData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

export const deleteAddress = async (addressId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}/${addressId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};