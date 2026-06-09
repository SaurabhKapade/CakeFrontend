import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance.js";
import toast from "react-hot-toast";

function axiosErrorMessage(error, fallback) {
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (error.message) return error.message;
  return fallback;
}

const initialState = {
  cakesData: [],
  currentCake: null,
  isLoading: false,
  isLoadingOne: false,
  isMutating: false,
  isSearching: false,
  error: null,
  oneError: null,
  searchError: null,
};

export const fetchCakes = createAsyncThunk(
  "cake/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cake");
      return res.data;
    } catch (error) {
      toast.error("Cannot load cakes");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const fetchCakeById = createAsyncThunk(
  "cake/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/cake/${id}`);
      return res.data;
    } catch (error) {
      toast.error("Cannot get cake");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const addCake = createAsyncThunk(
  "cake/add",
  async (cakeData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/cake/add", cakeData);
      toast.success("Cake added");
      return res.data;
    } catch (error) {
      toast.error("Add failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const deleteCake = createAsyncThunk(
  "cake/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/cake/${id}`);
      toast.success("Cake deleted");
      return id;
    } catch (error) {
      toast.error("Delete failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const updateCake = createAsyncThunk(
  "cake/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/cake/update/${id}`, data);
      toast.success("Cake updated");
      return res.data;
    } catch (error) {
      toast.error("Update failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const searchCake = createAsyncThunk(
  "cake/search",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cake/search", {
        params: {
          name: params.name || "",
          category: params.category || undefined,
        },
      });
      return res.data;
    } catch (error) {
      toast.error("Cake search failed");
      return rejectWithValue(axiosErrorMessage(error, "Search failed"));
    }
  }
);

const cakeSlice = createSlice({
  name: "cake",
  initialState,
  reducers: {
    clearCurrentCake(state) {
      state.currentCake = null;
      state.oneError = null;
    },
    clearSearch(state) {
      state.searchError = null;
      state.cakesData = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCakes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCakes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cakesData = action.payload?.data ?? [];
      })
      .addCase(fetchCakes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchCakeById.fulfilled, (state, action) => {
        state.currentCake = action.payload?.data ?? null;
      })

      .addCase(addCake.fulfilled, (state, action) => {
        const newCake = action.payload?.data;
        if (newCake) state.cakesData.unshift(newCake);
      })

      .addCase(deleteCake.fulfilled, (state, action) => {
        state.cakesData = state.cakesData.filter(
          (c) => (c._id || c.id) !== action.payload
        );
      })

      .addCase(updateCake.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        const index = state.cakesData.findIndex(
          (c) => (c._id || c.id) === (updated._id || updated.id)
        );
        if (index !== -1) state.cakesData[index] = updated;
      })

      .addCase(searchCake.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchCake.fulfilled, (state, action) => {
        state.isSearching = false;
        state.cakesData = action.payload?.data ?? [];
      })
      .addCase(searchCake.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
      });
  },
});

export const { clearCurrentCake, clearSearch } = cakeSlice.actions;
export default cakeSlice.reducer;