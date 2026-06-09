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
  bouquetsData: [],
  currentBouquet: null,
  isLoading: false,
  isLoadingOne: false,
  isMutating: false,
  isSearching: false,
  error: null,
  oneError: null,
  searchError: null,
};

export const fetchBouquets = createAsyncThunk(
  "bouquet/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/bouquet");
      return res.data;
    } catch (error) {
      toast.error("Cannot load bouquets");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const fetchBouquetById = createAsyncThunk(
  "bouquet/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/bouquet/${id}`);
      return res.data;
    } catch (error) {
      toast.error("Cannot get bouquet");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const addBouquet = createAsyncThunk(
  "bouquet/add",
  async (bouquetData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/bouquet/add", bouquetData);
      toast.success("Bouquet added");
      return res.data;
    } catch (error) {
      toast.error("Add failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const deleteBouquet = createAsyncThunk(
  "bouquet/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/bouquet/${id}`);
      toast.success("Bouquet deleted");
      return id;
    } catch (error) {
      toast.error("Delete failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const updateBouquet = createAsyncThunk(
  "bouquet/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/bouquet/update/${id}`, data);
      toast.success("Bouquet updated");
      return res.data;
    } catch (error) {
      toast.error("Update failed");
      return rejectWithValue(axiosErrorMessage(error, "Failed"));
    }
  }
);

export const searchBouquet = createAsyncThunk(
  "bouquet/search",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/bouquet/search", {
        params: {
          name: params.name || "",
          category: params.category || undefined,
        },
      });
      return res.data;
    } catch (error) {
      toast.error("Bouquet search failed");
      return rejectWithValue(axiosErrorMessage(error, "Search failed"));
    }
  }
);

const bouquetSlice = createSlice({
  name: "bouquet",
  initialState,
  reducers: {
    clearCurrentBouquet(state) {
      state.currentBouquet = null;
      state.oneError = null;
    },
    clearBouquetSearch(state) {
      state.searchError = null;
      state.bouquetsData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBouquets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBouquets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bouquetsData = action.payload?.data ?? [];
      })
      .addCase(fetchBouquets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchBouquetById.pending, (state) => {
        state.isLoadingOne = true;
        state.oneError = null;
      })
      .addCase(fetchBouquetById.fulfilled, (state, action) => {
        state.isLoadingOne = false;
        state.currentBouquet = action.payload?.data ?? null;
      })
      .addCase(fetchBouquetById.rejected, (state, action) => {
        state.isLoadingOne = false;
        state.oneError = action.payload;
      })
      .addCase(addBouquet.fulfilled, (state, action) => {
        const newBouquet = action.payload?.data;
        if (newBouquet) state.bouquetsData.unshift(newBouquet);
      })
      .addCase(deleteBouquet.fulfilled, (state, action) => {
        state.bouquetsData = state.bouquetsData.filter(
          (b) => (b._id || b.id) !== action.payload
        );
      })
      .addCase(updateBouquet.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        const index = state.bouquetsData.findIndex(
          (b) => (b._id || b.id) === (updated._id || updated.id)
        );
        if (index !== -1) state.bouquetsData[index] = updated;
        if (
          state.currentBouquet &&
          (state.currentBouquet._id || state.currentBouquet.id) ===
            (updated._id || updated.id)
        ) {
          state.currentBouquet = updated;
        }
      })
      .addCase(searchBouquet.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchBouquet.fulfilled, (state, action) => {
        state.isSearching = false;
        state.bouquetsData = action.payload?.data ?? [];
      })
      .addCase(searchBouquet.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.payload;
      });
  },
});

export const { clearCurrentBouquet, clearBouquetSearch } = bouquetSlice.actions;
export default bouquetSlice.reducer;
