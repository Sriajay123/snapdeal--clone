import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import pincodeReducer from './pincodeSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    pincode: pincodeReducer,
    notification: notificationReducer,
  },
});

// Listen for cart changes and persist to localStorage (for non-RTK actions)
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.cart));
});

export default store;
