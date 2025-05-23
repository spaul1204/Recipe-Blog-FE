import { createSlice } from "@reduxjs/toolkit";

// Function to load user from localStorage
const loadUserFromStorage = () => {
  try {
    const serializedUser = localStorage.getItem("user");
    if (serializedUser === null) {
      return null;
    }
    return JSON.parse(serializedUser);
  } catch (error) {
    console.error("Could not load user from localStorage", error);
    return null;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: loadUserFromStorage(), // Load initial state from localStorage
  reducers: {
    addUser: (state, action) => {
      try {
        const serializedUser = JSON.stringify(action.payload);
        localStorage.setItem("user", serializedUser);
      } catch (error) {
        console.error("Could not save user to localStorage", error);
      }
      return action.payload;
    },
    removeUser: (state, action) => {
      try {
        localStorage.removeItem("user");
      } catch (error) {
        console.error("Could not remove user from localStorage", error);
      }
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
