import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoginModalVisible: false,
    isRegisterModalVisible: true, 
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showLoginModal: (state) => {
            state.isLoginModalVisible = true;
            state.isRegisterModalVisible = false; 
        },
        hideLoginModal: (state) => {
            state.isLoginModalVisible = false;
        },
        showRegisterModal: (state) => {
            state.isLoginModalVisible = true; 
            state.isRegisterModalVisible = true;
        
        },
        hideRegisterModal: (state) => {
            state.isRegisterModalVisible = false;
        },
    },
});

export const { showLoginModal, hideLoginModal, showRegisterModal, hideRegisterModal } = modalSlice.actions;

export const selectIsLoginModalVisible = (state) => state.modal.isLoginModalVisible;
export const selectIsRegisterModalVisible = (state) => state.modal.isRegisterModalVisible;

export default modalSlice.reducer;
