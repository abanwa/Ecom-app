import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// GET ALL PRODUCTS WITH FILTERS
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams
    });
    const result = await axios.get(
      `${productionServerUrl}/api/shop/products/get?${query.toString()}`
    );

    return result?.data;
  }
);

// GET PRODUCT DETAIL BASE ON ID
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `${productionServerUrl}/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        console.log(
          "shop action.paylod in store/shop.products/index.js : ",
          action?.payload
        );
        state.isLoading = false;
        state.productList = action?.payload?.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        console.log(
          "shop action.paylod in fetchProductDetails in store/shop.products/index.js : ",
          action?.payload
        );
        state.isLoading = false;
        state.productDetails = action?.payload?.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  }
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
