import { configureStore, createSlice } from "@reduxjs/toolkit";

// Placeholder slice - replace with actual slices as needed
const appSlice = createSlice({
    name: 'app',
    initialState: {
        initialized: true
    },
    reducers: {}
});

const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
})

export default store