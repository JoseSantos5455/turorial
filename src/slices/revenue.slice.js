import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  revenue: null,
};

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    setRevenue: (state, action) => {
      state.revenue = action.payload;
    },
    clearRevenue: (state) => {
      state.revenue = null;
    },
  },
});

export const { setRevenue, clearRevenue } = revenueSlice.actions;
export default revenueSlice.reducer;
