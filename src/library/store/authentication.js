import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postMethod } from "../api";
import { loginUrl } from "../constant";

const initialState = {
  value: {
    isLogged: false,
    loginData: null,
  },
};

export const authenticateUser = createAsyncThunk(
  "authentication/user",
  async (data, thunkAPI) => {
    const response = await postMethod(loginUrl, data);
    return response;
  }
);

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.value = {
        isLogged: action.payload.isLogged,
        loginData: action.payload.loginData,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.value.isLogged = true;
        state.value.loginData = action.payload; // Assuming payload contains the user data
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.value.isLogged = false;
        state.value.loginData = null;
      })
      .addCase(authenticateUser.pending, (state) => {
        state.value.isLogged = false;
        state.value.loginData = null;
      });
  },
});

export const { updateUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
