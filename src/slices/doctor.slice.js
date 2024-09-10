import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctor: null,
};

const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    setDoctor: (state, action) => {
      state.doctor = action.payload;
    },
    clearDoctor: (state) => {
      state.doctor = null;
    },
  },
});

export const { setDoctor, clearDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
