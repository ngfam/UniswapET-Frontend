import { createSlice } from "@reduxjs/toolkit";

export enum SCREEN {
    LOGIN_SCREEN,
    SIGNUP_SCREEN,
    APP_SCREEN,
    DASHBOARD_SCREEN
}

export const screenSlice = createSlice({
    name: 'screen',
    initialState: SCREEN.LOGIN_SCREEN,
    reducers: {
        updateScreen: (state, action) => {
            state = action.payload;
            return state;
        }
    }
})

export const { updateScreen } = screenSlice.actions
export default screenSlice.reducer;