import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    location: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setAvatar: (state, action) => {
            if (state.user) {
                state.user.avatar = action.payload;
            }
        },
        setLocation: (state, action) => {
            state.location = action.payload;
        }
    },
});

export const { setUser, clearUser, setAvatar, setLocation } = userSlice.actions;
export const selectLoacation = (state) => state.post1.location;
export default userSlice.reducer;
