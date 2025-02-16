import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  orderList: [],
  orderDetails: null
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// this will get all the user's order base on the userId
export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `${productionServerUrl}/api/admin/orders/get`
    );
    return response?.data;
  }
);

// this will get the order details base on the order id
export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `${productionServerUrl}/api/admin/orders/details/${id}`
    );
    return response?.data;
  }
);

// update order status base on the order id
export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${productionServerUrl}/api/admin/orders/update/${id}`,
      { orderStatus }
    );
    return response?.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetailsForAdmin: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action?.payload?.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action?.payload?.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  }
});

export const { resetOrderDetailsForAdmin } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
