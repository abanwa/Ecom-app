import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: []
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const result = await axios.post(
      `${productionServerUrl}/api/admin/products/add`,
      formData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get(
      `${productionServerUrl}/api/admin/products/get`
    );

    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${productionServerUrl}/api/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `${productionServerUrl}/api/admin/products/delete/${id}`
    );

    return result?.data;
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        console.log(
          "action.paylod is from AdminProductSlice : ",
          action?.payload
        );
        state.isLoading = false;
        state.productList = action.payload?.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        console.log(
          "action.paylod is from AdminProductSlice : ",
          action?.payload
        );
        state.isLoading = false;
        state.productList = [];
      });
  }
});

export default AdminProductsSlice.reducer;
