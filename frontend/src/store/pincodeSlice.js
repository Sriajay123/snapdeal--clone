import { createSlice } from '@reduxjs/toolkit';

const pincodeSlice = createSlice({
  name: 'pincode',
  initialState: {
    value: '',
  },
  reducers: {
    setPincode: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPincode } = pincodeSlice.actions;
export default pincodeSlice.reducer;