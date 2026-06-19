import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/orders", orderData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/orders");
      return response.data.data;
    } catch (error) {
      console.log("Error fetching orders:", error);
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/orders/myorders");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch your orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/api/orders/${orderId}/cancel`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${orderId}/status`, {
        status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

const initialState = {
  ordersData: [],
  myOrders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersData = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.myOrders = [action.payload, ...state.myOrders];
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.myOrders.findIndex((o) => o._id === updated._id);
        if (idx !== -1) state.myOrders[idx] = updated;
        const adminIdx = state.ordersData.findIndex((o) => o._id === updated._id);
        if (adminIdx !== -1) state.ordersData[adminIdx] = updated;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.ordersData.findIndex(
          (o) => o._id === updatedOrder._id
        );
        if (index !== -1) {
          state.ordersData[index] = updatedOrder;
        }
        const myIdx = state.myOrders.findIndex((o) => o._id === updatedOrder._id);
        if (myIdx !== -1) state.myOrders[myIdx] = updatedOrder;
      });
  },
});

export default orderSlice.reducer;
