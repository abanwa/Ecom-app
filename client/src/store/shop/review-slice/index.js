import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  reviews: []
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// Add a review about a product
export const addReview = createAsyncThunk(
  "/review/addReview",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productionServerUrl}/api/shop/review/add`,
        formData
      );

      return response?.data;
    } catch (err) {
      // Check if the error is an Axios error
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return rejectWithValue(err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
        return rejectWithValue({ message: "Network error" });
      } else {
        // Something happened in setting up the request that triggered an Error
        return rejectWithValue({ message: err.message });
      }
    }
  }
);

// GET reviews of a product base on product ID
export const getReviews = createAsyncThunk("/review/getReviews", async (id) => {
  const response = await axios.get(
    `${productionServerUrl}/api/shop/review/${id}`
  );

  return response?.data;
});

const shopReviewSlice = createSlice({
  name: "shopReviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action?.payload?.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  }
});

export default shopReviewSlice.reducer;
