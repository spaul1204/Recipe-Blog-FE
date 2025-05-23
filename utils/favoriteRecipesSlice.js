import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // To store the array of favorite recipe objects
  showOnlyFavorites: false, // To toggle the favorite recipes view
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const favoriteRecipesSlice = createSlice({
  name: "favoriteRecipes",
  initialState,
  reducers: {
    setFavoriteRecipes: (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null; // Clear previous errors
    },
    addSingleFavoriteRecipe: (state, action) => {
      // Avoid duplicates if the recipe is already favorited
      if (!state.items.find((recipe) => recipe._id === action.payload._id)) {
        state.items.push(action.payload);
      }
      state.status = "succeeded"; // Assuming add is a success
    },
    removeSingleFavoriteRecipe: (state, action) => {
      state.items = state.items.filter(
        (recipe) => recipe._id !== action.payload._id // action.payload should be the recipeId
      );
    },
    toggleShowOnlyFavorites: (state) => {
      state.showOnlyFavorites = !state.showOnlyFavorites;
    },
    setFavoritesLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setFavoritesError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    // Could also add a specific reducer for addSingleFavoriteLoading etc. if needed
  },
});

export const {
  setFavoriteRecipes,
  addSingleFavoriteRecipe,
  removeSingleFavoriteRecipe,
  toggleShowOnlyFavorites,
  setFavoritesLoading,
  setFavoritesError,
} = favoriteRecipesSlice.actions;

export default favoriteRecipesSlice.reducer;
