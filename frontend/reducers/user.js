import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: {
    token: null,
    firstName: null,
    email: null,
    events: [],
    balance: 0,
    transactions: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.firstName = action.payload.firstName;
      state.value.balance = action.payload.balance;
      state.value.transactions = action.payload.transactions;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.firstName = null;
      state.value.balance = 0;
      state.value.transactions = null;
    },
    addBalance: (state, action) => {
      state.value.balance += action.payload;
    },
    downBalance: (state, action) => {
      state.value.balance -= action.payload;
    },
  },
});

export const { login, logout, addBalance, downBalance } = userSlice.actions;
export default userSlice.reducer;
