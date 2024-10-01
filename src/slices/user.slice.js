import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
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
    },
});

export const { setUser, clearUser, setAvatar } = userSlice.actions;
export default userSlice.reducer;
