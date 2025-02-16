import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sort: "price-lowtohigh",
  filters: JSON.parse(sessionStorage.getItem("filters")) || {}
};

const shopAppSlice = createSlice({
  name: "shoppingAppSlice",
  initialState,
  reducers: {
    setNewSort: (state, action) => {
      //console.log("Current Sort Value : ", action.payload);
      state.sort = action.payload;
    },
    setNewFilter: (state, action) => {
      //console.log("Current FILTERS : ", action.payload);
      // console.log("Current FILTERS2222 : ", action);
      state.filters = action.payload;
      sessionStorage.setItem("filters", JSON.stringify(action.payload));
    }
  }
});

export const { setNewSort, setNewFilter } = shopAppSlice.actions;
export default shopAppSlice.reducer;
