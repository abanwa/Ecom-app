import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

// This is use for call APIs

// FOR REGISTER

const productionServerUrl = import.meta.env.VITE_PRODUCTION_URL;
const developmentServerUrl = import.meta.env.VITE_DEVELOPMENT_URL;

//rejectWithValue is an axios function
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productionServerUrl}/api/auth/register`,
        formData,
        { withCredentials: true }
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

// FOR LOGIN
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productionServerUrl}/api/auth/login`,
        formData,
        { withCredentials: true }
      );

      console.log("Data login : ", response?.data);
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

// FOR LOGOUT
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${productionServerUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true
        }
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

// FOR REGISTER
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${productionServerUrl}/api/auth/check-auth`,
        {
          withCredentials: true,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate"
          }
        }
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("LOGIN ACTION : ", action?.payload);
        state.isLoading = false;
        state.user = action?.payload?.success ? action.payload?.user : null;
        state.isAuthenticated = action?.payload?.success ? true : false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action?.payload?.success ? action.payload?.user : null;
        state.isAuthenticated = action?.payload?.success ? true : false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
