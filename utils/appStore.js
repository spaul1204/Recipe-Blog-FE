import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import recipeReducer from "./recipeSlice";
import favoriteRecipesReducer from "./favoriteRecipesSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    recipe: recipeReducer,
    favoriteRecipes: favoriteRecipesReducer,
  },
});

export default store;
