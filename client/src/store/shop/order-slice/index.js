import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null
};

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

// make paypal payment for the ordered items and store the order
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${productionServerUrl}/api/shop/order/create`,
      orderData
    );
    return response?.data;
  }
);

// capture/confirm paypal payment
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ token, payerId, orderId }) => {
    const response = await axios.post(
      `${productionServerUrl}/api/shop/order/capture`,
      { token, payerId, orderId }
    );
    return response?.data;
  }
);

// this will get all the user's order base on the userId
export const getAllOrderByUserId = createAsyncThunk(
  "/order/getAllOrderByUserId",
  async (userId) => {
    const response = await axios.get(
      `${productionServerUrl}/api/shop/order/list/${userId}`
    );
    return response?.data;
  }
);

// this will get the order details base on the order id
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${productionServerUrl}/api/shop/order/details/${id}`
    );
    return response?.data;
  }
);

const shopOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action?.payload?.approvalURL;
        state.orderId = action?.payload?.orderId;
        // we will save the orderId when the payment is successful/fulfilled
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action?.payload?.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrderByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action?.payload?.data;
      })
      .addCase(getAllOrderByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action?.payload?.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  }
});

export const { resetOrderDetails } = shopOrderSlice.actions;
export default shopOrderSlice.reducer;
