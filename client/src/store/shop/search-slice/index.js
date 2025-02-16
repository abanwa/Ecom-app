import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: []
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// we will search the product table base on the keyword that was used to search
export const getSearchResults = createAsyncThunk(
  "/search/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `${productionServerUrl}/api/shop/search/${keyword}`
    );
    return response?.data;
  }
);

const shopSearchSlice = createSlice({
  name: "shopSearchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action?.payload?.data;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  }
});

export const { resetSearchResults } = shopSearchSlice.actions;
export default shopSearchSlice.reducer;
