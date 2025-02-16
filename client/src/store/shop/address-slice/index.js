import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: []
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// TO ADD NEW ADDRESS
export const addNewAddress = createAsyncThunk(
  "/addresses/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${productionServerUrl}/api/shop/address/add`,
      formData
    );
    return response?.data;
  }
);

// TO FETCH ALL THE ADDRESS FOR THE USER BASE ON THE USER ID
export const fetchAllAddresses = createAsyncThunk(
  "/addresses/fetchAllAddresses",
  async (userId) => {
    const response = await axios.get(
      `${productionServerUrl}/api/shop/address/get/${userId}`
    );
    return response?.data;
  }
);

// TO UPDATE THE ADDRESS BASE ON USER ID AND ADDRESS ID
export const editaAddress = createAsyncThunk(
  "/addresses/editaAddress",
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${productionServerUrl}/api/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response?.data;
  }
);

// TO DELETE A ADDRESS FROM THE ADDRESS
export const deleteAddress = createAsyncThunk(
  "/addresses/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${productionServerUrl}/api/shop/address/delete/${userId}/${addressId}`
    );
    return response?.data;
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload?.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(editaAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(editaAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  }
});

export default addressSlice.reducer;
