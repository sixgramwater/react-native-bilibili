import { createSlice } from "@reduxjs/toolkit";

export interface navState {
  origin: any;
  destination: any;
  travelTimeInformation: any;
}

const initialState: navState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
};

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.origin = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.origin = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInformation } =
  navSlice.actions;


export default navSlice.reducer;