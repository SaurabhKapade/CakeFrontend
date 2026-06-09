import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", response.data.data);
        return response.data;
      }
      return rejectWithValue(response.data.message || "Login failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred during login"
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("token");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  }
);

const initialState = {
  isAuthenticated: localStorage.getItem("isLoggedIn") === "true",
  token: localStorage.getItem("token") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.data;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
