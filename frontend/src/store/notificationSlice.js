import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    showSuccess: false,
    message: '',
  },
  reducers: {
    showSuccessNotification: (state, action) => {
      state.showSuccess = true;
      state.message = action.payload;
    },
    hideSuccessNotification: (state) => {
      state.showSuccess = false;
      state.message = '';
    },
  },
});

export const { showSuccessNotification, hideSuccessNotification } = notificationSlice.actions;
export default notificationSlice.reducer;