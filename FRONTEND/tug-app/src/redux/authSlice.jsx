import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : null,
    token : null,
    isLoggedIn : false,
    loading : false,
    error : null,
}
 const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        loginStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess : (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout : (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
        }
    }
 });

 export const {loginStart, loginSuccess, loginFailure, logout} = authSlice.actions;
 export const authReducer = authSlice.reducer;