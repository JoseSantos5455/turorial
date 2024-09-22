import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    doctor: null,
};

const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setCourse: (state, action) => {
            state.course = action.payload;
        },
        clearCourse: (state) => {
            state.course = null;
        },
        setNote: (state, action) => {
            // Assuming you want to store notes in the state
            state.note = action.payload; 
        },
    },
});

export const { setDoctor, clearDoctor,setNote } = courseSlice.actions;
export default courseSlice.reducer;
