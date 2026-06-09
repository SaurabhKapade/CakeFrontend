import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  category: "all",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setCategoryFilter(state, action) {
      state.category = action.payload;
    },
    resetSearchFilters() {
      return initialState;
    },
  },
});

export const { setSearchQuery, setCategoryFilter, resetSearchFilters } =
  searchSlice.actions;
export default searchSlice.reducer;
