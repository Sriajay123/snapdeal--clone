import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage if available
const loadCart = () => {
  try {
    const data = localStorage.getItem('cart');
    if (data) return JSON.parse(data);
  } catch {}
  return { items: [], count: 0 };
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.product._id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      state.count += 1;
      // Persist to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const idx = state.items.findIndex(item => item.product._id === productId);
      if (idx !== -1) {
        state.count -= state.items[idx].quantity;
        state.items.splice(idx, 1);
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existing = state.items.find(item => item.product._id === productId);
      if (existing && quantity > 0) {
        const diff = quantity - existing.quantity;
        existing.quantity = quantity;
        state.count += diff;
      }
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.count = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
