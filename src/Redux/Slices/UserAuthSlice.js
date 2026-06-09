import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

function readStoredUser() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

const storedUser = readStoredUser();

const initialState = {
    user: storedUser,
    isLoggedIn: !!storedUser,
    isLoading: false,
};

export const registerUser = createAsyncThunk("/auth/register", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/auth/register", data);
        toast.success(response.data?.message || "OTP sent to email");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to register");
        return rejectWithValue(error.response?.data);
    }
});

export const verifyOtp = createAsyncThunk("/auth/verifyOtp", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/auth/verify-otp", data);
        toast.success(response.data?.message || "Email verified successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to verify OTP");
        return rejectWithValue(error.response?.data);
    }
});

export const loginUser = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", data);
        toast.success("Logged in successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to login");
        return rejectWithValue(error.response?.data);
    }
});

export const logoutUser = createAsyncThunk("/auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post("/api/auth/logout");
        toast.success("Logged out successfully");
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to logout");
        return rejectWithValue(error.response?.data);
    }
});

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isLoggedIn = true;
                state.user = action.payload?.data?.user;
                localStorage.setItem('user', JSON.stringify(action.payload?.data?.user));
            })
            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.user = null;
                localStorage.removeItem('user');
            });
    }
});

export default userAuthSlice.reducer;
