import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: []
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// this will get the feature images used in our home page in the frontend
export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${productionServerUrl}/api/common/feature/get`
    );
    return response?.data;
  }
);

// this will add a feature image
export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productionServerUrl}/api/common/feature/add/`,
        { image }
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

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action?.payload?.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  }
});

export default commonSlice.reducer;
