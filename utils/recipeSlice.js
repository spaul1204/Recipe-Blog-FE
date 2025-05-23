import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
  name: "recipe",
  initialState: null,
  reducers: {
    addRecipe: (state, action) => {
      return action.payload;
    },
    removeRecipe: (state, action) => {
      return state.filter((recipe) => recipe._id !== action.payload);
    },
  },
});

export default recipeSlice.reducer;
export const { addRecipe, removeRecipe } = recipeSlice.actions;
